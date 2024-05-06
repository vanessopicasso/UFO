const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const activityDao = require("../../dao/activity-dao.js");
const planDao = require("../../dao/plan-dao.js");
const petProfileDao = require("../../dao/petProfile-dao.js");
const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    planId: { type: "string", minLength: 32, maxLength: 32 }, // ID of the plan to which the activity belongs
    name: { type: "string", minLength: 3 },
    time: { type: "string", pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$" }, // Format: HH:MM
    repeat: { type: "string", enum: ["hourly", "daily", "weekly", "monthly", "yearly"] }, // Allowed values for repetition
    notes: { type: "string" } // Optional field for additional notes
  },
  required: ["planId", "name", "time", "repeat"],
  additionalProperties: false,
};

async function CreateActivity(req, res) {
  try {
    let activity = req.body;

    // validate input
    const valid = ajv.validate(schema, activity);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // Retrieve the user ID from the request object
    const userId = req.user ? req.user.id : undefined;

    // Check if user ID is present
    if (!userId) {
      res.status(401).json({
        code: "unauthorized",
        message: "User is not authenticated",
      });
      return;
    }

    // Get the list of pet profiles associated with the user
    const userPetProfiles = userDao.get(userId).petProfiles;

    // Check if the associated plan exists
    const existingPlan = planDao.get(activity.planId);
    if (!existingPlan) {
    res.status(404).json({
        code: "planNotFound",
        message: `Plan ${activity.planId} not found`,
    });
    return;
    }

    // Retrieve the pet profile associated with the plan
    const associatedPetProfile = petProfileDao.getByPlanId(activity.planId);
    if (!associatedPetProfile) {
      res.status(404).json({
        code: "petProfileNotFound",
        message: `Pet profile associated with plan ${activity.planId} not found`,
      });
      return;
    }
    
    // Check if the pet profile associated with the plan is part of the user's pet profiles
    if (!userPetProfiles.includes(associatedPetProfile.id)) {
      res.status(403).json({
        code: "forbidden",
        message: "User is not authorized to create an activity for this pet profile",
      });
      return;
    }

    // Create the activity
    activity = activityDao.create(activity);

    // Update the plan with the new activity
    existingPlan.activities = existingPlan.activities || [];
    existingPlan.activities.push(activity.id);
    
    // Update the plan with the new activity
    planDao.update(existingPlan);

    res.json(activity);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateActivity;