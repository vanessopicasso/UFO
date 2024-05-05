const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const planFolderPath = path.join(__dirname, "storage", "planList");

// Method to read a plan from a file
function get(planId) {
  try {
    const filePath = path.join(planFolderPath, `${planId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadPlan", message: error.message };
  }
}

// Method to write a plan to a file
function create(plan) {
  try {
    plan.id = crypto.randomBytes(16).toString("hex");
    // Initialize activities array
    plan.activities = [];
    const filePath = path.join(planFolderPath, `${plan.id}.json`);
    const fileData = JSON.stringify(plan);
    fs.writeFileSync(filePath, fileData, "utf8");
    return plan;
  } catch (error) {
    throw { code: "failedToCreatePlan", message: error.message };
  }
}


// Method to remove a plan from a file
function remove(planId) {
  try {
    const filePath = path.join(planFolderPath, `${planId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemovePlan", message: error.message };
  }
}

// Method to list plans in a folder
function list() {
  try {
    const files = fs.readdirSync(planFolderPath);
    const planList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(planFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    planList.sort((a, b) => new Date(a.date) - new Date(b.date));
    return planList;
  } catch (error) {
    throw { code: "failedToListPlans", message: error.message };
  }
}

function addActivityToPlan(planId, activityId) {
  try {
    const plan = get(planId);
    if (!plan) {
      throw { code: "planNotFound", message: `Plan ${planId} not found` };
    }

    plan.activities = plan.activities || [];
    plan.activities.push(activityId);

    update(plan);
  } catch (error) {
    throw { code: "failedToAddActivityToPlan", message: error.message };
  }
}

function removeActivityFromPlan(planId, activityId) {
  try {
    const plan = get(planId);
    if (!plan) {
      throw { code: "planNotFound", message: `Plan ${planId} not found` };
    }

    plan.activities = plan.activities.filter((id) => id !== activityId);

    update(plan);
  } catch (error) {
    throw { code: "failedToRemoveActivityFromPlan", message: error.message };
  }
}

module.exports = {
  get,
  create,
  remove,
  list,
  addActivityToPlan,
  removeActivityFromPlan
};