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
      if (req.user._id.toString() === newFriend) {
        return next(createError(400, "You can't be friends with yourself!"));
      }

      User.findByIdAndUpdate(id, { $addToSet: { friends: newFriend } })
        .then(() => {
          res.json({ status: true });
        })
        .catch((err) => {
          return next(err);
        });
    },
  ],
  DELETE: [
    isAuthenticated,
    (req, res, next) => {
      let friendToDelete = req.params.friendid;
      let currentUser = req.user;
      let idOfUser = req.params.id;

      if (idOfUser !== currentUser._id.toString())
        return next(
          400,
          createError("You can't delete friends on behalf of other people!")
        );

      currentUser
        .update({ $pull: { friends: friendToDelete } })
        .then(() => {
          res.json({ status: true });
        })
        .catch((err) => {
          return next(err);
        });
    },
  ],
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

module.exports = controller;
