const express = require('express');
const morgan =  require('morgan');
const globalErrorHandler = require('./controllers/errorController');
const tourRoute =  require('./routes/tourRoutes');
const userRoute =  require('./routes/userRoutes');
const AppError = require('./utils/appError');

const app = express();

// middleware 
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('div'));
}
app.use(express.json());
app.use((req , res, next) => {
  next()
});
app.use(express.static(`${__dirname}/public`));

// routers
app.use('/api/v1/tours' , tourRoute);
app.use('/api/v1/users' , userRoute);

app.all('*' , (req , res, next) => {
  next(new AppError(`can't find ${req.originalUrl}`, 404))
});

app.use(globalErrorHandler)

module.exports = app 