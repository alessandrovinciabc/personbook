const mongoose = require('mongoose');
const debug = require('debug')('personbook:db');

function initializeDB() {
  mongoose
    .connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      debug('Succesfully connected to database.');
    })
    .catch(() => {
      debug('Error while connecting to database.');
    });
}

module.exports = initializeDB;
