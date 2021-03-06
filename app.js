const express = require('express');
const app = express();
const createError = require('http-errors');

/* Database */
require('./util/setupMongoose')();

/* Middleware */
const helmet = require('helmet');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
app.use(helmet());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({ checkPeriod: 86400000 }),
    resave: false,
    saveUninitialized: false,
  })
);

const passport = require('passport');

const passportSetup = require('./util/setupPassport');
app.use(passportSetup);
app.use(passport.initialize());
app.use(passport.session());

const cookieParser = require('cookie-parser');
const logger = require('morgan');

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Static files */
const STATIC_FOLDER = require('./util/static');
const path = require('path');
app.use('/public', express.static(STATIC_FOLDER));
app.use('/static', express.static(path.join(STATIC_FOLDER, 'static')));

/* Routes */
const apiRouter = require('./routes/api');
const indexRouter = require('./routes/index');

app.use('/api', apiRouter);
app.use(
  '*',
  (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      const url = req.originalUrl;
      if (url.match(/^\/api/g))
        return next(createError(404, 'Page not found.'));

      res.redirect('http://localhost:3001' + url);
    } else {
      const path = require('path');
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    }
  },
  indexRouter
);

app.use((err, req, res, next) => {
  if (err.statusCode === 404) return res.redirect('/404');

  res.status(err.status || 500).send('Error: ' + err.message);
});

module.exports = app;
