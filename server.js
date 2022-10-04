const mongoose = require('mongoose');

const dotenv = require(`dotenv`);
dotenv.config({ path: 'config.env' });
const app = require(`./app`);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//connection with database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connection stabled now'));

//4) START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
  console.log('db connection successful');
});

//unhandled error
process.on('unhandledRejection', (err) => {
  console.log('ERROR NAME', err.name, 'ERROR MESSAGE', err.message);
  console.log('UNHANDLER REJECTION ERROR');
  server.close(() => {
    process.exit(1);
  });
});
