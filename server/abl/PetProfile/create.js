const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const userDao = require("../../dao/user-dao.js");
const petProfileDao = require("../../dao/petProfile-dao.js");

const schema = {
  type: "object",
  properties: {
    species: { type: "string", enum: ["cat", "dog", "rat", "snake", "fish"] },
    name: { type: "string", minLength: 1 },
    breed: { type: "string" },
    sex: {type: "string", enum: ["male", "female"]},
    birthDate: {type: "string", format: "date"},
    weight: { type: "number" },
    adittionalDetails: { type: "string" },
    profilePicture: { type: "object" }
    // More propperties can be added here in case of need
  },
  required: ["species", "name", "breed", "birthDate", "weight"],
  additionalProperties: false,
};

async function CreatePetProfile(req, res) {
  try {
    let petProfile = req.body;

    // Validate input
    const valid = ajv.validate(schema, petProfile);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    

    // Get user ID from request object
    const userId = req.user ? req.user.id : undefined;

    // Check if user ID is present
    if (!userId) {
      res.status(401).json({
        code: "unauthorized",
        message: "User is not authenticated",
      });
      return;
    }

    // Create the pet profile
    petProfile = petProfileDao.create(petProfile);

    // Associate the pet profile with the user who created it
    userDao.addPetProfileToUser(userId, petProfile.id);
    
    res.json(petProfile);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreatePetProfile;