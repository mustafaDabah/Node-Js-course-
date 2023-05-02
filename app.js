const express = require('express');
const morgan =  require('morgan');
// const cors = require('cors');
const rateLimit =  require('express-rate-limit');
const helmet =  require('helmet');
const mongoSanitize =  require('express-mongo-sanitize');
const xss =  require('xss-clean');
const hpp =  require('hpp');
const globalErrorHandler = require('./controllers/errorController');
const tourRoute =  require('./routes/tourRoutes');
const userRoute =  require('./routes/userRoutes');
const reviewRoute =  require('./routes/reviewRoutes');
const AppError = require('./utils/appError');

// 1) GLOBAL MIDDLEWARES 
const app = express();

// SET HTTP SECURITY (related  to headers (XSS attack , embedded different domain iframe ))
app.use(helmet());
// app.use(cors());

// SET DEVELOPMENT LOGGING
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('div'));
}

// SET LIMIT REQUESTS
const limiter = rateLimit({
  max:100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api' , limiter);

// READ DATA FROM BODY req.body 
app.use(express.json({limit: '10kb'}));

// DATA SANITIZATION AGAINST NO SQL QUERY INJECTION`
app.use(mongoSanitize({
  whitelist: {
    $gt: true,
  },
}));

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// PREVENT PARAMETER POLLUTION (dublicate query string)
app.use(hpp({
  whitelist: ['duration' , 'ratingAverage' , 'ratingQuantity', 'maxGroupSize', 'price', 'difficulty']
}))

// SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

// 2) ROUTES
app.use('/api/v1/tours' , tourRoute);
app.use('/api/v1/users' , userRoute);
app.use('/api/v1/reviews' , reviewRoute);

app.all('*' , (req , res, next) => {
  next(new AppError(`can't find ${req.originalUrl}`, 404))
});

app.use(globalErrorHandler)

module.exports = app 