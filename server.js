//Imports
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' }); //Importing environment variables
// console.log(app.get('env'));
// console.log(process.env);

const app = require('./app');

//Database Connection String
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//Database Connection
// .connect(process.env.DATABASE_LOCAL, {
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB Connection Successful');
  });

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//handling rejected promises globally
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!!!, Shutting Down');
  console.log(err.name, err.message);
  server.close(() => {
    //shutdown our app
    process.exit(1); // for rejected promises, this step is optional
  });
});

//handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!!!, Shutting Down');
  console.log(err.name, err.message);
  server.close(() => {
    //shutdown our app
    process.exit(1); // this step is a must for uncaught exceptions
  });
});
console.log(x);
