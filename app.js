const express = require('express');

const app = express();

/////////get request//////////
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from server side', app: 'Natours' });
});

////////////Post Request/////
app.post('/', (req, res) => {
  res.send('You can post to this endpoint..');
});

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
