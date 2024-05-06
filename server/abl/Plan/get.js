const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const planDao = require("../../dao/plan-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetPlan(req, res) {
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

    // read plan by given id
    const plan = planDao.get(reqParams.id);
    if (!plan) {
      res.status(404).json({
        code: "planNotFound",
        message: `Plan ${reqParams.id} not found`,
      });
      return;
    }

    res.json(plan);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetPlan;