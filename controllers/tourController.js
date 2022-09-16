const fs = require('fs');

/////////Get api //////////
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
////ROUTE HANDLERS

/////////get all tours//////
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

//////////get single tour///
exports.getTour = (req, res) => {
  console.log(req.params);
  //
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'id not found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

////////Create Tour/////
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  //
  tours.push(newTour);
  //
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

//////Update Tour//////////////
exports.updateTour = (req, res) => {
  console.log('now');
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'id not found',
    });
  }
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
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'id not found',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
