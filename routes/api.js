const express = require('express');
const router = express.Router();

const passport = require('passport');

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
