const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// Protects routes: requires "Authorization: Bearer <token>"
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized, token missing" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error); // JWT errors are handled in errorHandler
  }
};

module.exports = { protect };
