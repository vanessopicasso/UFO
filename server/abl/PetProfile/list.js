const petProfileDao = require("../../dao/petProfile-dao.js");

async function ListPetProfile(req, res) {
  try {
    const petProfileList = petProfileDao.list();

    res.json(petProfileList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListPetProfile;