//Imports
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' }); //Importing environment variables
// console.log(app.get('env'));
// console.log(process.env);

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
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB Connection Successful');
  });

//Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

//Import Data into Database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully Loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete all Data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
