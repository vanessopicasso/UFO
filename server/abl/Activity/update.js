const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const activityDao = require("../../dao/activity-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    planId: { type: "string", minLength: 32, maxLength: 32 },
    name: { type: "string", minLength: 3 },
    time: { type: "string", format: "time" },
    repeat: { type: "string", enum: ["hourly", "daily", "weekly", "monthly", "yearly"] },
    notes: { type: "string" } // optional field for notes
  },
  required: ["id", "planId", "name", "time", "repeat"],
  additionalProperties: false,
};

async function UpdateActivity(req, res) {
  try {
    let activity = req.body;

    // validate input
    const valid = ajv.validate(schema, activity);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const updatedActivity = activityDao.update(activity);
    if (!updatedActivity) {
      res.status(404).json({
        code: "activityNotFound",
        message: `Activity ${activity.id} not found`,
      });
      return;
    }

    res.json(updatedActivity);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateActivity;