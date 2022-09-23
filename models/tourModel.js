const mongoose = require('mongoose');
const slugify = require('slugify');

//Basic Tour Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual property
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Middleware

//DOCUMENT MIDDLEWARE: runs before .save() and .create()

//pre middleware: will run before an actual event
//the callback will be called before an actual document is saved on the database
tourSchema.pre('save', function (next) {
  // console.log(this);
  //this at this point is the currently processed document
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', function (next) {
//   console.log('Will save document');
//   next();
// });

//post middleware: will run after an actual event
//executed after all pre middlewares are executed
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//Create a model out of the schema above.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
