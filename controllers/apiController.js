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

/* Posts */
const Post = require('../models/Post');
controller.post = {
  POST: [
    isAuthenticated,
    (req, res, next) => {
      let authorId = req.user._id.toString();
      let textForNewPost = req.body.text;

      Post.create({ author: authorId, text: textForNewPost })
        .then((newDoc) => {
          res.json(newDoc);
        })
        .catch((err) => {
          next(err);
        });
    },
  ],
  GETOne: [
    isAuthenticated,
    (req, res, next) => {
      let requestedPostId = req.params.id;
      Post.findById(requestedPostId)
        .then((doc) => {
          res.json(doc);
        })
        .catch((err) => {
          next(err);
        });
    },
  ],
  GETAll: [
    isAuthenticated,
    (req, res, next) => {
      let userId = req.params.id;

      Post.find({ author: userId })
        .sort('-createdAt')
        .then((posts) => res.json(posts))
        .catch((err) => next(err));
    },
  ],
  DELETE: [
    isAuthenticated,
    (req, res, next) => {
      let currentUserId = req.user._id.toString();
      let requestedPostId = req.params.id;

      Post.findById(requestedPostId)
        .then((found) => {
          if (found.author.toString() !== currentUserId)
            return next(createError(400, "Can't delete other people's posts!"));

          return found
            .deleteOne()
            .then(() =>
              res.json({ msg: 'Succesfully removed post', status: true })
            );
        })
        .catch((err) => {
          next(err);
        });
    },
  ],
  UPDATE: [
    isAuthenticated,
    (req, res, next) => {
      let requestedPostId = req.params.id;
      let newText = req.body.text;

      Post.findByIdAndUpdate(requestedPostId, { text: newText })
        .then(() => res.json({ msg: 'Succesfully updated post', status: true }))
        .catch((err) => next(err));
    },
  ],
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

const FriendRequest = require('../models/FriendRequest');

controller.friends = {
  GET: [
    isAuthenticated,
    (req, res, next) => {
      let { id } = req.params;

      FriendRequest.find({ $or: [{ from: id }, { to: id }] })
        .then((requests) => {
          let friends = [],
            youRequested = [],
            theyRequested = [];

          requests.forEach((request) => {
            let hasMirrors = false;

            requests.forEach((requestToCompare) => {
              let areMirrored =
                requestToCompare.from.equals(request.to) &&
                requestToCompare.to.equals(request.from);

              if (areMirrored) {
                let idOfOtherUser = request.to.equals(id)
                  ? request.from
                  : request.to;

                if (!friends.includes(idOfOtherUser.toString()))
                  friends.push(idOfOtherUser.toString());

                hasMirrors = true;
              }
            });

            if (hasMirrors) return;

            if (request.from.equals(id)) {
              youRequested.push(request.to.toString());
            } else if (request.to.equals(id)) {
              theyRequested.push(request.from.toString());
            }
          });

          res.json({
            userId: id,
            requests,
            friends,
            youRequested,
            theyRequested,
          });
        })
        .catch((err) => {
          next(err);
        });
    },
  ],
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

      FriendRequest.create({ from: req.user._id, to: newFriend })
        .then((newDoc) => {
          res.json({ status: true, result: newDoc });
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

      if (
        idOfUser !== currentUser._id.toString() &&
        friendToDelete !== currentUser._id.toString()
      )
        return next(
          400,
          createError("You can't delete friends on behalf of other people!")
        );

      FriendRequest.findOneAndDelete({ from: idOfUser, to: friendToDelete })
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
