const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const userPayload = (user) => ({ id: user._id, name: user.name, email: user.email });

// POST /api/users/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
        errors: { email: "Email is already registered" },
      });
    }

    const user = await User.create({ name, email, password }); // password hashed in model hook
    res.status(201).json({ success: true, token: signToken(user._id), user: userPayload(user) });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Incorrect email or password" });
    }

    res.json({ success: true, token: signToken(user._id), user: userPayload(user) });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/me  (protected)
const getMe = async (req, res) => {
  res.json({ success: true, user: userPayload(req.user) });
};

module.exports = { registerUser, loginUser, getMe };
