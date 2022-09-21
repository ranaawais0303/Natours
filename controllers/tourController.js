const Tour = require(`./../models/tourModel`);

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price',
    });
  }
  next();
};

////ROUTE HANDLERS

/////////get all tours//////
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

//////////get single tour///
exports.getTour = (req, res) => {
  //
  const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

////////Create Tour/////
exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    // data: {
    //   tour: newTour,
    // },
  });
};

//////Update Tour//////////////
exports.updateTour = (req, res) => {
  console.log('now');

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated Tours Here>',
    },
  });
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
