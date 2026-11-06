// 404 for unknown routes
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Central error handler: always responds with { success, message, errors? }
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";
  let errors;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.fromEntries(Object.values(err.errors).map((e) => [e.path, e.message]));
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {}).find((k) => k !== "owner") || "field";
    message = `A record with this ${field} already exists`;
    errors = { [field]: message };
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired, please log in again";
  } else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Request body is not valid JSON";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== "production" && statusCode === 500 && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
