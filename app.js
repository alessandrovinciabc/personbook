const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const logger = require('morgan');

app.use(logger('tiny'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Static files */
const STATIC_FOLDER = require('./static');
const path = require('path');
app.use('/public', express.static(STATIC_FOLDER));
app.use('/static', express.static(path.join(STATIC_FOLDER, 'static')));

/* Routes */
const apiRouter = require('./routes/api');
const indexRouter = require('./routes/index');

app.use('/api', apiRouter);
app.use('*', indexRouter);

module.exports = app;
