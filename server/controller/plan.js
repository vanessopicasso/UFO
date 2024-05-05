const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/plan/get");
const ListAbl = require("../abl/Plan/list");
const CreateAbl = require("../abl/Plan/create");
const DeleteAbl = require("../abl/Plan/delete");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;