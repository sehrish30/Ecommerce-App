const express = require("express");
const router = express.Router();

const { createOrUpdateUser, currentUser } = require("../controllers/auth");

// middlewares
const { authCheck } = require("../middlewares/auth");

// controller
router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);

module.exports = router;
