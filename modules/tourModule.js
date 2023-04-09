const mongoose =  require('mongoose');
const  slugify = require('slugify');
const validator =  require('validator');
const User = require('./userModule');

const tourSchema = new mongoose.Schema({
    name:{
      type: String,
      required:[true, 'A tour must have a name'],
      unique:[true, 'A tour must have a unique name'],
      trim:true,
      maxLength:[40 , 'A tour must have less or equal than 40 characters'],
      minLength:[10 , 'A tour must have more or equal than 10 characters'], 
      // validate: [validator.isAlpha ,'Tour name must only contain characters']
    },
    slug:String,
    duration:{
      type:Number,
      required:[true, 'A tour must have a duration']
    },
    maxGroupSize:{
      type:Number,
      required:[true, 'A tour must have a group size']
    },
    difficulty:{
      type:String,
      required:[true, 'A tour must have a difficulty'],
      enum: {
        values:['easy' , 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult '
      }
    },
    ratingAverage:{
      type: Number,
      default:4.5,
      min: [1 , 'Rating must have above 1.0'],
      max: [5 , 'Rating must have below 5.0'],
    },
    ratingQuantity:{
      type: Number,
      default:0
    },
    price:{
      type: Number,
      required:[true, 'A tour must have a Price'],
    },
    priceDiscount:{
      type: Number,
      validate:{
        validator:function(val) {
          return val < this.price ;
        },
        message:"Discount price ({VALUE}) should be below regular price",
      }
    },
    summary:{
      type:String,
      trim:true,
      required:true
    },
    description:{
      type:String,
      trim:true,
    },
    imageCover:{
      type:String,
      required:[true, 'A tour must have a cover image'],
    },
    images:[String],
    createdAt:{
      type:Date,
      default:Date.now(),
      select:false
    }, 
    startDates:[Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation:{
      type: {
        type:String,
        default:"Point",
        enum:['Point']
      }, 
      coordinates:[Number],
      address:String,
      description: String
    },
    locations:[
      {
        type: {
          type:String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
}, {
  toJSON:{virtuals: true},
  toObject:{virtuals: true}
})

// >>> virtual query
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7 
})

// >>> document middleware runs before save() and create()
tourSchema.pre('save' , function(next) {
  this.slug = slugify(this.name , {lower: true});
  next();
})

// >>> get users guides but this with embedding
tourSchema.pre('save' , async function(next) {
  const guidesPromise = this.guides.map(async(id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromise)

  next();
})

tourSchema.post('save' , (doc, next) => {
  console.log(doc)
  next();
});

// >>> Query middleware
tourSchema.pre(/^find/ , function(next) {
// tourSchema.pre('find' , function(next) {
  this.find({secretTour: {$ne: true}});
  this.start = Date.now();
  next()
});

tourSchema.pre(/^find/ , function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt -passwordResetExpires -passwordResetToken'
  })

  next();
})

// tourSchema.post(/^find/ , function(docs, next) {
//   console.log(`query took ${Date.now() - this.start} millSeconds`);
//   next();
// })

// >>> aggregation middleware 
tourSchema.pre('aggregate' , function(next) {
  this.pipeline().unshift({
    $match: {secretTour: {$ne: true}}
  });

  console.log(this.pipeline());
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

 module.exports = Tour
  