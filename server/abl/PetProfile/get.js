const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const petProfileDao = require("../../dao/petProfile-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetPetProfile(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.id ? req.query : req.body;

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

    // read petProfile by given id
    const petProfile = petProfileDao.get(reqParams.id);
    if (!petProfile) {
      res.status(404).json({
        code: "petProfileNotFound",
        message: `petProfile ${reqParams.id} not found`,
      });
      return;
    }

    res.json(petProfile);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetPetProfile;