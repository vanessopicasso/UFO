const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    name: { type: "string", minLength: 3 },
    email: { type: "string", format: "email" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let user = req.body;

    // Validate input
    const valid = ajv.validate(schema, user);
    if (!valid) {
      return res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
    }

    // Check if email already exists for another user
    const userList = await userDao.list(); // Await userDao.list() to ensure completion
    const emailExists = userList.some(
      (u) => u.email === user.email && u.id !== user.id
    );
    if (emailExists) {
      return res.status(409).json({
        code: "emailAlreadyExists",
        message: `User with email ${user.email} already exists`,
      });
    }

    // Update user
    const updatedUser = await userDao.update(user); // Await userDao.update() to ensure completion
    if (!updatedUser) {
      return res.status(404).json({
        code: "userNotFound",
        message: `User ${user.id} not found`,
      });
    }

    res.json(updatedUser);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;