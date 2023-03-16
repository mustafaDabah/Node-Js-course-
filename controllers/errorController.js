const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status:err.status,
    message: err.message,
    error:err,
    stack:err.stack
  });
}

const sendErrorProduction = (err, res) => {
  // operational, trusted error: send message to client
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status:err.status,
      message: err.message
    });

  // programming or other unknown error: don't leak error details
  }else {
    console.error('error' , err);
    res.status(500).json({
      status:'error',
      message: "something went very wrong",
      error:err
    });
  }
}

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}: please use another value!`;

  return new AppError(message, 400)

}

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400)
}

const handleJWTError = () => new AppError('invalid token , please log in again!', 401);
const handleJWTExpireError = () => new AppError('your token has expired, please log in again!', 401);

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
      let error = {...err};

      if (err.name === 'CastError') error = handleCastErrorDB(error);
      if(err.code === 11000) error = handleDuplicateFieldsDB(error)
      if(err.name === 'ValidationError') error = handleValidatorErrorDB(error);
      // JWT ERRORS
      if(err.name === 'JsonWebTokenError') error = handleJWTError(error);
      if(err.name === 'TokenExpiredError') error = handleJWTExpireError(error);
      sendErrorProduction(error, res);
    }
} 