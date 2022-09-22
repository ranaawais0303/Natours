const Tour = require(`./../models/tourModel`);

////ROUTE HANDLERS

/////////get all tours//////
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      data: {
        status: 'Fail',
        message: err,
      },
    });
  }
};

//////////get single tour///
exports.getTour = async (req, res) => {
  //
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id:req.params.id}) same

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      data: {
        status: 'Fail',
        message: err,
      },
    });
  }
};

////////Create Tour/////
exports.createTour = async (req, res) => {
  try {
    // const newTour=new Tour({});
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      data: {
        status: 'Fail',
        message: err,
      },
    });
  }
};

//////Update Tour//////////////
exports.updateTour = async (req, res) => {
  try {
    //new for new value which edit
    //runValidator for schema which fixed
    //req.body mean edit body where edit any value

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      data: {
        status: 'Fail',
        message: err,
      },
    });
  }
};

//////////Delete Tour//////////
exports.delelteTour = (req, res) => {
  console.log('now');
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

///////////////////////////////////////////////
//check id by middleware
// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'id not found',
//     });
//   }
//   next();
// };
