const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//delete
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

/////update
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //new for new value which edit
    //runValidator for schema which fixed
    //req.body mean edit body where edit any value

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that ID'));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

//Create
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
