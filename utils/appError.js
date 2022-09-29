class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //to track if an error is operational or not

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
