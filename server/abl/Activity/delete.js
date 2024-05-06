const Ajv = require("ajv");
const ajv = new Ajv();

const activityDao = require("../../dao/activity-dao.js");
const planDao = require("../../dao/plan-dao.js");
const petProfileDao = require("../../dao/petProfile-dao.js");
const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteActivity(req, res) {
  try {
    // get request query or body
    const reqParams = req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
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
    const associatedPlanId = planDao.getPlanIdByActivityId(reqParams.id);

    // Check if the associated plan exists
    const existingPlan = planDao.get(associatedPlanId);
    if (!existingPlan) {
      res.status(404).json({
        code: "planNotFound",
        message: `Plan associated with activity ${reqParams.id} not found`,
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
        message: "User is not authorized to delete an activity for this pet profile",
      });
      return;
    }

    // Remove the activity
    activityDao.remove(reqParams.id);
    
    // Remove the activity from the plan
    planDao.removeActivityFromPlan(reqParams.id);
    
    res.json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteActivity;