const express = require('express');
const router = express.Router();

const passport = require('passport');

const createError = require('http-errors');

function isAuthenticated(req, res, next) {
  if (req.user == null) return res.redirect('/');
  next();
}

router.get('/', function (req, res) {
  res.json({ msg: 'api' });
});

router.get('/account', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

const User = require('../models/User');

router.get('/user', isAuthenticated, (req, res, next) => {
  let { page = 1 } = req.query;
  page = parseInt(page);

  if (Number.isNaN(page) || page <= 0)
    return next(createError(400, 'Invalid page number for list of users.'));

  const ENTRIES_PER_PAGE = 10;

  User.find({})
    .sort({ createdAt: -1 })
    .skip(ENTRIES_PER_PAGE * (page - 1))
    .limit(ENTRIES_PER_PAGE)
    .then((users) => res.json(users))
    .catch((err) => next(err));
});

router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/error' }),
  function (req, res) {
    res.redirect('/');
  }
);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/error' }),
  function (req, res) {
    res.redirect('/');
  }
);

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/error' }),
  function (req, res) {
    res.redirect('/');
  }
);

router.get('/auth/error', (req, res) => {
  res.send('Auth error.');
});

module.exports = router;
