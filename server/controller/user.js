const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/User/get");
const ListAbl = require("../abl/User/list");
const CreateAbl = require("../abl/User/create");
const UpdateAbl = require("../abl/User/update");
const DeleteAbl = require("../abl/User/delete");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;