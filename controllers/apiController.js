const passport = require('passport');

const User = require('../models/User');
const paginateMongoose = require('../util/paginateMongoose');

function isAuthenticated(req, res, next) {
  if (req.user == null) return res.redirect('/');
  next();
}

let controller = {};
controller.account = {
  GET: [
    isAuthenticated,
    (req, res) => {
      res.json({ user: req.user });
    },
  ],
};

controller.user = {
  GET: [isAuthenticated, paginateMongoose(User)],
};

controller.auth = {};
controller.auth.error = {
  GET: (req, res) => {
    res.send('Auth error.');
  },
};

controller.auth.logout = {
  GET: (req, res) => {
    req.logout();
    res.redirect('/');
  },
};

/*********************/
/* OAuth Controllers */
/*********************/

controller.auth.github = {
  GET: passport.authenticate('github'),
  callback: [
    passport.authenticate('github', { failureRedirect: '/auth/error' }),
    function (req, res) {
      res.redirect('/');
    },
  ],
};

controller.auth.google = {
  GET: passport.authenticate('google', { scope: ['profile'] }),
  callback: [
    passport.authenticate('google', { failureRedirect: '/auth/error' }),
    function (req, res) {
      res.redirect('/');
    },
  ],
};

controller.auth.facebook = {
  GET: passport.authenticate('facebook'),
  callback: [
    passport.authenticate('facebook', { failureRedirect: '/auth/error' }),
    function (req, res) {
      res.redirect('/');
    },
  ],
};

module.exports = controller;
