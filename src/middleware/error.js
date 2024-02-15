const ErrorResponse = require("../utils/errorResponse");
//Error handler middleware to handle create readable error responses.
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  // Log to console for dev
  if ((process.env.NODE_ENV = "development")) {
    console.log(err);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose validation error
  if (err.name === "ValidationError") {
    //Map the validation errors for clients.
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
