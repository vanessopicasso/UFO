const fs = require("fs").promises; // Using fs.promises for async file operations
const path = require("path");
const crypto = require("crypto");

const userFolderPath = path.join(__dirname, "storage", "userList");

async function get(userId) {
  try {
    const filePath = path.join(userFolderPath, `${userId}.json`);
    const fileData = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadUser", message: error.message };
  }
}

async function create(user) {
  try {
    user.id = crypto.randomBytes(16).toString("hex");
    user.petProfiles = [];
    const filePath = path.join(userFolderPath, `${user.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(user), "utf8");
    return user;
  } catch (error) {
    throw { code: "failedToCreateUser", message: error.message };
  }
}

async function update(user) {
  try {
    const currentUser = await get(user.id);
    if (!currentUser) return null;
    const newUser = { ...currentUser, ...user };
    const filePath = path.join(userFolderPath, `${user.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(newUser), "utf8");
    return newUser;
  } catch (error) {
    throw { code: "failedToUpdateUser", message: error.message };
  }
}

async function remove(userId) {
  try {
    const filePath = path.join(userFolderPath, `${userId}.json`);
    await fs.unlink(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveUser", message: error.message };
  }
}

async function list() {
  try {
    const files = await fs.readdir(userFolderPath);
    const userList = await Promise.all(files.map(async (file) => {
      const fileData = await fs.readFile(path.join(userFolderPath, file), "utf8");
      return JSON.parse(fileData);
    }));
    return userList;
  } catch (error) {
    throw { code: "failedToListUsers", message: error.message };
  }
}

async function addPetProfileToUser(userId, petProfileId) {
  try {
    const user = await get(userId);
    if (!user) {
      throw { code: "userNotFound", message: `User ${userId} not found` };
    }
    user.petProfiles = user.petProfiles || [];
    user.petProfiles.push(petProfileId);
    await update(user);
  } catch (error) {
    throw { code: "failedToAddPetProfileToUser", message: error.message };
  }
}

async function removePetProfileFromUser(userId, petProfileId) {
  try {
    const user = await get(userId);
    if (!user) {
      throw { code: "userNotFound", message: `User ${userId} not found` };
    }
    user.petProfiles = user.petProfiles.filter((id) => id !== petProfileId);
    await update(user);
  } catch (error) {
    throw { code: "failedToRemovePetProfileFromUser", message: error.message };
  }
}

async function authenticateUser(username, email) {
  try {
    const userList = await list();
    const authenticatedUser = userList.find(
      (user) => user.username === username && user.email === email
    );
    return authenticatedUser || null;
  } catch (error) {
    throw { code: "authenticationFailed", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  addPetProfileToUser,
  removePetProfileFromUser,
  authenticateUser
};