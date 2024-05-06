const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/User/get");
const ListAbl = require("../abl/User/list");
const CreateAbl = require("../abl/User/create");
const UpdateAbl = require("../abl/User/update");
const DeleteAbl = require("../abl/User/delete");

router.get("/get", GetAbl); // Retrieves a specific user
router.get("/list", ListAbl); // Lists all users
router.post("/create", CreateAbl); // Creates a new user
router.post("/update", UpdateAbl); // Updates an existing user
router.post("/delete", DeleteAbl); // Deletes an existing user

module.exports = router;