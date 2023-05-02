const express = require('express');
const morgan = require('morgan');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandlers = require('./controller/errorController');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const reviewRouter = require('./Routes/reviewRoutes');

// Start express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set('View Engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) Global Middleware
// Serving static files
app.use(express.static(`${__dirname}/public`));
// Set security HTTP headers
app.use(helmet());

// Development loging
if (process.env.NODE_ENV === 'development') {
  console.log('development');
  app.use(morgan('dev'));
}

// Limit requests from same api
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, try after an hour',
});

app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

// prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'price',
      'maxGroupSize',
      'ratingsQuantity',
      'ratingsAverage',
    ],
  })
);

//Create a middleware for access the excution time and date
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//3) Routes and subroutes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//Create a middleware for undefined url and responds it with a msg
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find this url: ${req.originalUrl} on this server`,
  // });

  // const err = new Error(
  //   `can't find this url: ${req.originalUrl} on this server`
  // );
  // err.status = 'fail';
  // err.statusCode = 404;

  next(
    new AppError(`can't find this url: ${req.originalUrl} on this server`, 404)
  );
});

//Global error handling middleware
app.use(globalErrorHandlers);

module.exports = app;
