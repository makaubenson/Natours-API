const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit'); //rate limiting
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1)Global Middlewares
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//define limiter: it will allow 100 requests from same IP in a window period of 1 hour
const limiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an Hour!',
});
// limiter created above is a middleware
app.use('/api', limiter); // this will be effected to all routes that begin with /api

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); //serving static files - middleware

//Creating our own middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware!!');
//   // We need to call next() to avoid Request-Response cycle being stuck
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next(); //call next middleware in the call stack
});

//3) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//handling non-existent routes (should be the last after all other routes handlers)
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // create error
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err); //pass the error to skip all other middlewares and go to the global error handling middleware

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global Error handling middleware
// To define error handling middleware,all we need it to give it 4 arguments
app.use(globalErrorHandler);

module.exports = app;
