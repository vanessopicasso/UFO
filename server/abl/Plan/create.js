const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const petProfileDao = require("../../dao/petProfile-dao.js");
const planDao = require("../../dao/plan-dao.js");
const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    petId: { type: "string", minLength: 32, maxLength: 32 }, // ID of the pet profile to which the plan belongs
    type: { type: "string", enum: ["feeding", "cleaning", "exercise", "medical", "other"] },
  },
  required: ["type", "petId"],
  additionalProperties: false,
};

async function CreatePlan(req, res) {
  try {
    let plan = req.body;

    // validate input
    const valid = ajv.validate(schema, plan);
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
    const existingPetProfile = petProfileDao.get(plan.petId);
    if (!existingPetProfile) {
    res.status(404).json({
        code: "petProfileNotFound",
        message: `Pet profile ${plan.petId} not found`,
    });
    return;
    }
    
    // Check if the pet profile ID associated with the plan exists in the user's list of pet profiles
    if (!userPetProfiles.includes(plan.petId)) {
      res.status(403).json({
        code: "forbidden",
        message: "User is not authorized to create a plan for this pet profile",
      });
      return;
    }

    // Create the plan
    plan = planDao.create(plan);

    // Add the plan to the pet profile
    existingPetProfile.plans = existingPetProfile.plans || [];
    existingPetProfile.plans.push(plan.id);

    // Update the pet profile with the new plan
    petProfileDao.update(existingPetProfile);

    res.json(plan);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreatePlan;