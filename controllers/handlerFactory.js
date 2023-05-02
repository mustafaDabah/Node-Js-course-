const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) => catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id)

    if(!document) {
        return next(new AppError("No document found with this ID" , 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.updateOne = (Model) => catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(id, req.body, {
      new:true,
      runValidators:true
    });

    if(!document) {
      return next(new AppError("No document found with this ID" , 404));
    }

    res.status(200).json({ 
      status: 'success',
      data: {
        data: document
      }
    });
});

exports.createOne = (Model) => catchAsync(async(req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument, 
      },
    });
});

exports.getOne = (Model , popOptions) => catchAsync(async(req, res, next) => { 
  const { id } = req.params;
  let query = Model.findById(id);
  if (popOptions) query = query.populate(popOptions);

  const document = await query;

  if(!document) {
    return next(new AppError("No tour found with this ID" , 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: document,
    },
  });

});

exports.getAll = (Model) => catchAsync(async(req, res, next) => { 
  // TO NESTED REVIEW (SMALL HACK)
  let filter = {};
  if (req.params.tourId) filter = {tour: req.params.tourId};
  
  // EXECUTE QUERY
  const features = new APIFeatures(Model.find(filter) , req.query)
   .filter() 
   .sort()
   .limitFields()
   .paginate(); 

  // const documents = await features.query.explain() ;
  const documents = await features.query ;

  res.status(200).json({
    status: 'success',
    results: documents.length,
    data: {
      data: documents,
    },
  });
});