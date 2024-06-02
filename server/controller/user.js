const express = require("express");
const router = express.Router();

const getUser = require("../abl/User/get");
const listUsers = require("../abl/User/list");
const createUser = require("../abl/User/create");
const updateUser = require("../abl/User/update");
const deleteUser = require("../abl/User/delete");
const loginUser = require("../abl/User/login");

// Retrieve a specific user by ID
router.get("/user/:id", getUser);

// List all users
router.get("/users", listUsers);

// Create a new user
router.post("/user", createUser);

// Update an existing user by ID
router.put("/user/:id", updateUser);

// Delete an existing user by ID
router.delete("/user/:id", deleteUser);

router.post("/login", loginUser);

module.exports = router;