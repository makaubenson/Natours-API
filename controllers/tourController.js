const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//Param Middleware
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

//create checkBody middleware
//Check if body contains the name and price property
//if not, send back 400(Bad Request)
//Add it to the post handler stack
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

//Handlers
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query, 'BENSON');
    //BUILD QUERY
    //1)Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //2)Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr), 'MAKAU');
    //{difficulty: 'easy',duration:{$gte: 5}}
    //{difficulty: 'easy',duration:{gte: 5}}
    //gte,gt,lte,lt

    const query = Tour.find(JSON.parse(queryStr));

    //EXECUTE QUERY
    const tours = await query;

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        //   tours: tours,
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // console.log(req.params.id);
    const tour = await Tour.findById(req.params.id);
    //Tour.findById(req.params.id) would work the same as Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    //Method 1
    // const newTour = new Tour({});
    // newTour.save();

    //Method 2
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Invalid Data sent!`,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Invalid Data sent!`,
    });
  }
};
