// This adds status codes to Express Errors

class ErrorResponse extends Error {
  constructor(message, statusCode, details={}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Add a reusable class for registration errors

module.exports = ErrorResponse;