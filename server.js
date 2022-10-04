const mongoose = require('mongoose');

const dotenv = require(`dotenv`);

//this is at top because we may call
//reference error or un defined
//variable any time which may not caught
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION ERROR');
  console.log('ERROR Name', err.name, 'ERROR Message', err.message);
  process.exit(1);
});

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
  console.log('UNHANDLER REJECTION ERROR');
  console.log('ERROR Name', err.name, 'ERROR Message', err.message);

  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
