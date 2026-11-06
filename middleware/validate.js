// Request validation middleware (no extra dependencies)

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;
const STATUSES = ["lead", "active", "inactive"];

const respond = (res, errors) =>
  res.status(400).json({ success: false, message: "Validation failed", errors });

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = {};

  if (!name || name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!email || !EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
  if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";

  return Object.keys(errors).length ? respond(res, errors) : next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || !EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";

  return Object.keys(errors).length ? respond(res, errors) : next();
};

// partial = true for updates (only validate fields that are present)
const customerValidator = (partial) => (req, res, next) => {
  const { name, email, phone, status, notes } = req.body;
  const errors = {};

  if (!partial || name !== undefined) {
    if (!name || name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  }
  if (!partial || email !== undefined) {
    if (!email || !EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
  }
  if (phone && !PHONE_RE.test(phone)) errors.phone = "Enter a valid phone number";
  if (status !== undefined && !STATUSES.includes(status)) {
    errors.status = "Status must be lead, active or inactive";
  }
  if (notes && notes.length > 500) errors.notes = "Notes cannot exceed 500 characters";

  return Object.keys(errors).length ? respond(res, errors) : next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCustomerCreate: customerValidator(false),
  validateCustomerUpdate: customerValidator(true),
};
