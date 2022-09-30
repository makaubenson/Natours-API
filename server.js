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
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//handling rejected promises globally
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!!!, Shutting Down');
  //shutdown our app
  process.exit(1);
});
