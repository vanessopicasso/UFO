const Ajv = require("ajv");
const ajv = new Ajv();

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

async function DeletePlan(req, res) {
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

    // Get the list of pet profiles associated with the user
    const userPetProfiles = userDao.get(userId).petProfiles;

    // Check if the associated pet profile exists
    const existingPetProfile = petProfileDao.get(reqParams.id);
    if (!existingPetProfile) {
    res.status(404).json({
        code: "petProfileNotFound",
        message: `Pet profile ${reqParams.id} not found`,
    });
    return;
    }
    
    // Check if the pet profile ID associated with the plan exists in the user's list of pet profiles
    if (!userPetProfiles.includes(existingPetProfile.id)) {
      res.status(403).json({
        code: "forbidden",
        message: "User is not authorized to delete a plan for this pet profile",
      });
      return;
    }

    // Remove the plan
    planDao.remove(reqParams.id);
    
    // Remove the plan from the pet profile
    petProfileDao.removePlanFromProfile(existingPetProfile.id, reqParams.id);

    res.json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeletePlan;