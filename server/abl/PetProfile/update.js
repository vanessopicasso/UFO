const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const petProfileDao = require("../../dao/petProfile-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    name: { type: "string", minLength: 3 },
    breed: { type: "string" },
    sex: {type: "string", enum: ["male", "female"]},
    birthDate: {type: "string", format: "date"},
    weight: { type: "number" },
    adittionalDetails: { type: "string" },
    profilePicture: { type: "object" }
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
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

module.exports = UpdateAbl;