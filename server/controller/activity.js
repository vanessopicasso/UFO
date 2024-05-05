const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/Activity/get");
const ListAbl = require("../abl/Activity/list");
const CreateAbl = require("../abl/Activity/create");
const UpdateAbl = require("../abl/Activity/update");
const DeleteAbl = require("../abl/Activity/delete");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;