const userDao = require("../../dao/user-dao.js");

async function ListUsers(req, res) {
  try {
    const userList = await userDao.list(); // Await userDao.list() to ensure completion
    res.json(userList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListUsers;