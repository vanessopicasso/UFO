const Ajv = require("ajv");
const ajv = new Ajv();

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

async function DeletePetProfile(req, res) {
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

    // Check if the pet profile ID to be deleted exists in the user's list of pet profiles
    if (!userPetProfiles.includes(reqParams.id)) {
      res.status(403).json({
        code: "forbidden",
        message: "User is not authorized to delete this pet profile",
      });
      return;
    }

    petProfileDao.remove(reqParams.id);

    // Remove the pet profile from the user's list of pet profiles
    if (req.user && req.user.id) {
      userDao.removePetProfileFromUser(req.user.id, reqParams.id);
    }

    res.json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeletePetProfile;