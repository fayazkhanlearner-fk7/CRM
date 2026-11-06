const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/UserController");
const { protect } = require("../middleware/Auth");
const { validateRegister, validateLogin } = require("../middleware/validate");

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/me", protect, getMe);

module.exports = router;
