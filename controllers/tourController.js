const Tour = require(`./../models/tourModel`);

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

////ROUTE HANDLERS

/////////get all tours//////
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    //BUILD QUERY
    //1A)FILTERING
    const queryObj = { ...req.query };
    const excludedFieds = ['page', 'sort', 'limit', 'fields'];
    excludedFieds.forEach((el) => delete queryObj[el]);

    //1B)ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    //\b for exact /g for all
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    //{difficulty:'easy',duration:{$gte:5}} mongo command
    //{difficulty:'easy',duration:{gte:5}} req query return

    /////////////////////////////
    //1st way apply query
    let query = Tour.find(JSON.parse(queryStr));

    //2)Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      //sort('price ratingAverage')
    } else {
      //sort by descending order
      query = query.sort('-createdAt');
    }

    //3)Field limiting

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      //included fields
      query = query.select(fields);
    } else {
      //exclude __v
      query = query.select('-__v');
    }

    //4)Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    //EXECUTE THE QUERY
    const tours = await query;

    // 2nd way apply query
    // const query =  Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    console.log(err);
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
exports.delelteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
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
