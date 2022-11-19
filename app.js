const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit'); //rate limiting
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp'); //http parameter pollution
const cookieParser= require('cookie-parser'); //parse cookies to every request

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

//setup pug engine
app.set('view engine','pug');//express automatically supports pug
app.set('views',path.join(__dirname,'views'));

// 1)Global Middleware

//serving static files
// app.use(express.static(`${__dirname}/public`)); //serving static files - middleware
app.use(express.static(path.join(__dirname,'public'))); 

//Set Security HTTP Headers
app.use(helmet());

//Development Logging
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit Requests from same IP
//define limiter: it will allow 100 requests from same IP in a window period of 1 hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an Hour!',
});
// limiter created above is a middleware
app.use('/api', limiter); // this will be effected to all routes that begin with /api

//Body Parser: parses data from body into req.body
app.use(express.json({ limit: '10kb' }));

//cookie parser: parses data from cookies
app.use(cookieParser())

//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Testing Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next(); //call next middleware in the call stack
});

//3) Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//handling non-existent routes (should be the last after all other routes handlers)
app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global Error handling middleware
// To define error handling middleware,all we need it to give it 4 arguments
app.use(globalErrorHandler);

module.exports = app;
