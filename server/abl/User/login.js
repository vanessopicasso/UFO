const Ajv = require("ajv");
const ajv = new Ajv();

const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    const valid = ajv.validate(schema, { email, password });
    if (!valid) {
      res.status(400).json({
        code: "invalidRequest",
        message: "Invalid email or password",
        validationError: ajv.errors,
      });
      return;
    }

    // Authenticate user
    const user = userDao.authenticateUser(email, password);
    if (!user) {
      res.status(401).json({
        code: "authenticationFailed",
        message: "Invalid email or password",
      });
      return;
    }

    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = loginUser;