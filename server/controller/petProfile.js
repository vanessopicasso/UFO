const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/PetProfile/get");
const ListAbl = require("../abl/PetProfile/list");
const CreateAbl = require("../abl/PetProfile/create");
const UpdateAbl = require("../abl/PetProfile/update");
const DeleteAbl = require("../abl/PetProfile/delete");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;