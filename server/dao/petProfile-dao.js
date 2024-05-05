const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const petProfileFolderPath = path.join(__dirname, "storage", "petProfileList");

// Method to read a pet profile from a file
function get(petProfileId) {
  try {
    const filePath = path.join(petProfileFolderPath, `${petProfileId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadPetProfile", message: error.message };
  }
}

// Method to write a pet profile to a file
function create(petProfile) {
  try {
    petProfile.id = crypto.randomBytes(16).toString("hex");
    // Initialize plans array
    petProfile.plans = [];
    const filePath = path.join(petProfileFolderPath, `${petProfile.id}.json`);
    const fileData = JSON.stringify(petProfile);
    fs.writeFileSync(filePath, fileData, "utf8");
    return petProfile;
  } catch (error) {
    throw { code: "failedToCreatePetProfile", message: error.message };
  }
}

// Method to update a pet profile in a file
function update(petProfile) {
  try {
    const currentPetProfile = get(petProfile.id);
    if (!currentPetProfile) return null;
    const newPetProfile = { ...currentPetProfile, ...petProfile};
    const filePath = path.join(petProfileFolderPath, `${petProfile.id}.json`);
    const fileData = JSON.stringify(newPetProfile);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newPetProfile;
  } catch (error) {
    throw { code: "failedToUpdatePetProfile", message: error.message };
  }
}

// Method to remove a pet profile from a file
function remove(petProfileId) {
  try {
    const filePath = path.join(petProfileFolderPath, `${petProfileId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemovePetProfile", message: error.message };
  }
}

// Method to list pet profiles in a folder
function list() {
  try {
    const files = fs.readdirSync(petProfileFolderPath);
    const petProfileList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(petProfileFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    return petProfileList;
  } catch (error) {
    throw { code: "failedToListPetProfiles", message: error.message };
  }
}

// Method to add a plan to a pet profile
function addPlanToProfile(petProfileId, planId) {
  try {
    const petProfile = get(petProfileId);
    if (!petProfile) {
      throw { code: "petProfileNotFound", message: `Pet profile ${petProfileId} not found` };
    }

    petProfile.plans = petProfile.plans || [];
    petProfile.plans.push(planId);

    update(petProfile);
  } catch (error) {
    throw { code: "failedToAddPlanToProfile", message: error.message };
  }
}

// Method to remove a plan from a pet profile
function removePlanFromProfile(petProfileId, planId) {
  try {
    const petProfile = get(petProfileId);
    if (!petProfile) {
      throw { code: "petProfileNotFound", message: `Pet profile ${petProfileId} not found` };
    }

    petProfile.plans = petProfile.plans.filter((id) => id !== planId);

    update(petProfile);
  } catch (error) {
    throw { code: "failedToRemovePlanFromProfile", message: error.message };
  }
}


module.exports = {
  get,
  create,
  update,
  remove,
  list,
  addPlanToProfile,
  removePlanFromProfile,
};