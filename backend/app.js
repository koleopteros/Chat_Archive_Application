const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const db = require('./config/config').mongoURI;

const app = express();

// *********** Include the Api routes ***********
const chatRoutes = require("./routes/routes");

// *********** Connect to Mongo  ***********
console.log('Attempting to connect to mLab cluster...');

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Mongo database!");
  })
  .catch(err => {
    console.log(err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  next();
});

// ******** Setup the Api routes ***********
app.use(chatRoutes);

module.exports = app;
