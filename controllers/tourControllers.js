const Tour =  require('../modules/tourModule');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory =  require('./handlerFactory');

// >>>> Tours functions
exports.aliasTopTours = async(req, res, next) => {
  req.query.limit = '4';
  req.query.sort = '-price,-ratingAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
}

exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync(async(req, res, next) => { 
//     // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find() , req.query)
//      .filter() 
//      .sort()
//      .limitFields()
//      .paginate(); 

//     const tours = await features.query ;

//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
// });

exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsync(async(req, res, next) => {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour:newTour, 
//       },
//     });
// });

exports.getTour = factory.getOne(Tour, {path: 'reviews'});

// exports.getTour = catchAsync(async(req, res, next) => { 
//     const { id } = req.params;
//     const tour = await Tour.findById(id).populate({
//       path: 'reviews',
//       // select: 'review rating -tour '
//     });

//     if(!tour) {
//       return next(new AppError("No tour found with this ID" , 404));
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });

// });

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async(req, res, next) => {
//   const { id } = req.params;
//     const tour = await Tour.findByIdAndDelete(id)

//     if(!tour) {
//       return next(new AppError("No tour found with this ID" , 404));
//     }

//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
// });

exports.updateTour = factory.updateOne(Tour);

// exports.updateTour = catchAsync(async(req, res, next) => {
//     const { id } = req.params;
//     const tour = await Tour.findByIdAndUpdate(id, req.body, {
//       new:true,
//       runValidators:true
//     });

//     if(!tour) {
//       return next(new AppError("No tour found with this ID" , 404));
//     }

//     res.status(200).json({ 
//       status: 'success',
//       data: {
//         tour
//       }
//     });
// });

// /tours-distance/233/center/34.111,-118.113/unit/mi
exports.getToursWithin = catchAsync(async (req , res, next) => {
  const {distance, latlng, unit} = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if(!lat || !lng) next(new AppError('please provide latitutr and longitude in the format lat,lng.', 400));
  console.log(radius);

  const tours = await Tour.find({
    startLocation: {$geoWithin: {$centerSphere:[[lng, lat], radius] }}
  })

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  })
})

exports.getDistances = catchAsync(async (req , res, next) => {
  const {latlng, unit} = req.params;
  const [lat, lng] = latlng.split(',');

  if(!lat || !lng) next(new AppError('please provide latitutr and longitude in the format lat,lng.', 400));

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      },
    },
    {
      $project: {
        distance: 1,
        name:1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  })

})

exports.getTourStats = catchAsync(async(req , res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: {ratingAverage: {$gte: 4.5}}
      },
      {
        $group:{
          _id:{$toUpper: '$difficulty'},
          numTours:{ $sum: 1},
          numRatings:{$avg: 'ratingsAverage'},
          avgRating: {$avg: '$ratingAverage'},
          avgPrice: {$avg: '$price'},
          minPrice: {$min: '$price'},
          maxPrice: {$max: '$price'},
        },
      },
      {
        $sort: {avgPrice: 1}
      },
      // {
      //   $match: {_id: {$ne: "EASY"}}
      // }
    ])
 
    res.status(200).json({ 
      status: 'success',
      data: {
        stats
      }
    });
});

exports.getMonthlyPlan = catchAsync(async(req , res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match:{
          // secretTour: {$ne: true},
          startDates:{
            $gte:new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          },
        }
      },
      {
        $group: {
          _id: {$month: '$startDates'},
          numTourStarts: {$sum: 1},
          tours: {$push: '$name'}
        }
      },
      {
        $addFields: {month: '$_id'}
      },
      {
        $project: {
          _id:0
        }
      },
      {
        $sort: {numTourStarts: -1}
      },
      // {
      //   $limit: 12
      // }
    ]);

    res.status(200).json({ 
      status: 'success',
      results: plan.length,
      data: {
        plan
      }
    });
})

exports.getTripSize = catchAsync(async(req , res, next) => {
    const tripSize = await Tour.aggregate([
      {
        $match: {
          maxGroupSize:{
            $gte: 10,
            $lte:15
          },
          ratingAverage: {$gte: 4.5}
        }
      },
      {
        $group: {
          _id: {
            name: '$name',
            difficulty: '$difficulty'
          },
          size: {
            $sum: '$maxGroupSize'
          }
        }
      },
    ])

    res.status(200).json({
      status:'success',
      data: tripSize
    })
})