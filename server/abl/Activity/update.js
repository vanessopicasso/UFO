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
    id: { type: "string", minLength: 32, maxLength: 32 },
    planId: { type: "string", minLength: 32, maxLength: 32 },
    name: { type: "string", minLength: 3 },
    time: { type: "string", format: "time" },
    repeat: { type: "string", enum: ["hourly", "daily", "weekly", "monthly", "yearly"] },
    notes: { type: "string" } // optional field for notes
  },
  required: ["id", "planId", "name", "time", "repeat"],
  additionalProperties: false,
};

async function UpdateActivity(req, res) {
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

    // Get the associated plan ID for the activity
    const associatedPlanId = activity.planId;

    // Check if the associated plan exists
    const existingPlan = planDao.get(associatedPlanId);
    if (!existingPlan) {
      res.status(404).json({
        code: "planNotFound",
        message: `Plan ${associatedPlanId} not found`,
      });
      return;
    }

    // Retrieve the pet profile associated with the plan
    const associatedPetProfile = petProfileDao.getByPlanId(associatedPlanId);
    if (!associatedPetProfile) {
      res.status(404).json({
        code: "petProfileNotFound",
        message: `Pet profile associated with plan ${associatedPlanId} not found`,
      });
      return;
    }

    // Get the list of pet profiles associated with the user
    const userPetProfiles = userDao.get(userId).petProfiles;

    // Check if the pet profile associated with the plan is part of the user's pet profiles
    if (!userPetProfiles.includes(associatedPetProfile.id)) {
      res.status(403).json({
        code: "forbidden",
        message: "User is not authorized to update an activity for this pet profile",
      });
      return;
    }

    const updatedActivity = activityDao.update(activity);
    if (!updatedActivity) {
      res.status(404).json({
        code: "activityNotFound",
        message: `Activity ${activity.id} not found`,
      });
      return;
    }

    res.json(updatedActivity);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateActivity;