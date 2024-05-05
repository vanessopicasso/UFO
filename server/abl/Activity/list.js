const activityDao = require("../../dao/activity-dao.js");

async function ListActivities(req, res) {
  try {
    const activityList = activityDao.list();

    res.json(activityList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListActivities;