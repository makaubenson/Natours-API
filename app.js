const { json } = require('express');

const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middlewares
app.use(morgan('dev'));

app.use(express.json()); //middleware

//Creating our own middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware!!');
  // We need to call next() to avoid Request-Response cycle being stuck
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); //call next middleware in the callstack
});

//3) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//4) Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
