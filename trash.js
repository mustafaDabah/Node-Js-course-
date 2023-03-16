// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour)
// app.get('/api/v1/tours/:id', getTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.patch('/api/v1/tours/:id', updateTour);

// const testTour = new Tour({
//     name:"The Park Hiker",
//     rating:4.5,
//     price:888
//   })

// >>>>>>> tour controllers trash

// app.use((req , res, next) => {
//   console.log('hello middleware');
//   next()
// })

// app.use((req , res, next) => {
//   req.requestTime = new Date().toISOString();
//   next()
// }) 

// add meddleware first 
// router.param('id', tourControllers.checkId);

// exports.checkId = (req, res, next, value) => {
//     if (req.params.id > tours.length) {
//       return res.status(404).json({
//         status: 'failed',
//         message: 'invalid id',
//       });
//     }
  
//     next();
//   };

// router
//   .route('/')
//   .get(tourControllers.getAllTours)
//   .post(tourControllers.checkBody, tourControllers.createTour);

// exports.checkBody = (req, res, next) => {
//     console.log(req.body);
//     if (!req.body.name || !req.body.price) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'please make sure the price and name is right!',
//       });
//     }
//     next();
//   };
  
// >>>> How to make document
// const newTour = new Tour({});
// newTour.save()

// >>>> anther way to filter
// const tours = await Tour.find()
//       .where('duration')
//       .equals(5)
//       .where('difficulty')
//       .equals('easy')

// >>>> filter methods before class
  // FILTER
    // const queryObj = {...req.query};
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObj[el]);

    // console.log(queryObj)

    // let query = Tour.find(queryObj);

    // // SORTING  
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy)
    // } else {
    //   query.sort('-createdAt ')
    // }

    // // FIELD LIMITING
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v')
    // }

    // // PAGINATION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if(skip >= numTours) throw new Error('this page does not exist')
    // }

    // >>> Error message 
    // const err = new Error(`can't find ${req.originalUrl}`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err)

    // >>>> request function before error handlers
    // try { 
    //   // EXECUTE QUERY
    //   const features = new APIFeatures(Tour.find() , req.query)
    //    .filter() 
    //    .sort()
    //    .limitFields()
    //    .paginate(); 
  
    //   const tours = await features.query ;
  
    //   res.status(200).json({
    //     status: 'success',
    //     results: tours.length,
    //     data: {
    //       tours,
    //     },
    //   });
  
    // } catch (error) {
    //   res.status(404).json({
    //     status:'fail',
    //     message:"not found"
    //   })
    // }
  