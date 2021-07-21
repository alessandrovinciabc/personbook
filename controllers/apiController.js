const passport = require('passport');

const User = require('../models/User');
const paginateMongoose = require('../util/paginateMongoose');

const createError = require('http-errors');

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

controller.specificUser = {
  GET: async (req, res, next) => {
    let { id } = req.params;
    let requestedUser;
    try {
      requestedUser = await User.findById(id);
    } catch (err) {
      next(err);
    }

    if (requestedUser) return res.json(requestedUser);
    return res.status(404).json({ msg: 'User not found.' });
  },
};

controller.friends = {
  POST: [
    isAuthenticated,
    (req, res, next) => {
      let { id } = req.params;
      if (id !== req.user._id.toString())
        return next(
          createError(400, "You can't add friends on behalf of other people!")
        );

      let { newFriend } = req.body;
      User.findByIdAndUpdate(id, { $addToSet: { friends: newFriend } })
        .then(() => {
          res.json({ added: true });
        })
        .catch((err) => {
          return next(err);
        });
    },
  ],
  DELETE: (req, res) => {},
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
