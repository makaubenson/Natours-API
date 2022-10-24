const Tour = require('../models/tourModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

//Handlers
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

//aggregation pipeline use case
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    //match stage
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    //group stage
    {
      $group: {
        // _id: '$ratingsAverage',
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    //sorting stage (we use variable names that are used up in the GROUP stage)
    {
      //1 here represents ascending
      $sort: { avgPrice: 1 },
    },
    //Example below is to demonstrate we can actualy repeat stages
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; //2021
  const plan = await Tour.aggregate([
    //unwind
    {
      $unwind: '$startDates',
    },
    //match
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    //group
    {
      $group: {
        _id: { $month: '$startDates' }, //group by month
        numTourStats: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },

    //project
    {
      $project: {
        _id: 0, //works with 1 and 0, for 0 it means _id wont showup
      },
    },
    //sorting
    {
      $sort: { numTourStats: -1 },
    },
    //limit
    {
      $limit: 12, //limit to 12 outputs
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
