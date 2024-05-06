const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const petProfileDao = require("../../dao/petProfile-dao.js");
const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    name: { type: "string", minLength: 3 },
    breed: { type: "string" },
    sex: {type: "string", enum: ["male", "female"]},
    birthDate: {type: "string", format: "date"},
    weight: { type: "number" },
    additionalDetails: { type: "string" },
    profilePicture: { type: "object" }
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdatePetProfile(req, res) {
  try {
    let petProfile = req.body;

    // validate input
    const valid = ajv.validate(schema, petProfile);
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

    // Check if the pet profile ID to be deleted exists in the user's list of pet profiles
    if (!userPetProfiles.includes(reqParams.id)) {
      res.status(403).json({
        code: "forbidden",
        message: "User is not authorized to delete this pet profile",
      });
      return;
    }

    const updatedPetProfile = petProfileDao.update(petProfile);
    if (!updatedPetProfile) {
      res.status(404).json({
        code: "petProfileNotFound",
        message: `Pet Profile ${petProfile.id} not found`,
      });
      return;
    }

    res.json(updatedPetProfile);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdatePetProfile;