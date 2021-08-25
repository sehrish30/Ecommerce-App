const express = require("express");
const router = express.Router();

const { createOrUpdateUser } = require("../controllers/auth");

// middlewares
const { authCheck } = require("../middlewares/auth");

// controller
router.post("/create-or-update-user", authCheck, createOrUpdateUser);

module.exports = router;
