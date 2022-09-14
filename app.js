const fs = require('fs');
const express = require('express');

const app = express();
////express.json is middleware////

app.use(express.json());

/////////get request//////////
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from server side', app: 'Natours' });
// });

// ////////////Post Request/////
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint..');
// });

/////////Get api //////////
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

///POST API////////////
app.post('/api/v1/tours', (req, res) => {
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
  //   res.send('Done');
});

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
