const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3 },
    email: { type: "string", format: "email" },
  },
  required: ["name", "email"],
  additionalProperties: false,
};

async function CreateUser(req, res) {
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

    // Check if email already exists
    const userList = await userDao.list(); // Await userDao.list() to get the user list
    const emailExists = userList.some((u) => u.email === user.email);
    if (emailExists) {
      return res.status(409).json({
        code: "emailAlreadyExists",
        message: `User with email ${user.email} already exists`,
      });
    }

    // Create user
    user = await userDao.create(user); // Await userDao.create(user) to create the user
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateUser;