const passport = require('passport');

const User = require('../models/User');
const paginateMongoose = require('../util/paginateMongoose');

const createError = require('http-errors');

const axios = require('axios');

const { body, validationResult } = require('express-validator');

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
  PUT: [
    isAuthenticated,
    body('profilePicture').isURL(),
    (req, res, next) => {
      let newProfilePicture = req.body.profilePicture;

      console.log(newProfilePicture);

      if (newProfilePicture == null)
        return next(createError(400, 'Bad request.'));
      User.findById(req.user._id.toString()).then(user => {
        user.profilePicture = newProfilePicture;
        user.save().then(() => {
          res.json({ status: 'success' });
        });
      });
    },
  ],
};

controller.user = {
  GET: [isAuthenticated, paginateMongoose(User)],
};

/* Posts */
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
controller.likePost = {
  POST: [
    isAuthenticated,
    (req, res, next) => {
      let userId = req.user._id.toString();
      let postId = req.params.id;

      Like.findOneAndUpdate(
        { userId, postId },
        { userId, postId },
        { upsert: true }
      )
        .then(newDoc => {
          res.json(newDoc);
        })
        .catch(err => {
          next(err);
        });
    },
  ],
  GET: [
    isAuthenticated,
    (req, res, next) => {
      Like.find({ postId: req.params.id })
        .then(likes => {
          res.json(likes);
        })
        .catch(err => {
          next(err);
        });
    },
  ],
  DELETE: [
    isAuthenticated,
    (req, res, next) => {
      Like.findOneAndDelete({
        postId: req.params.id,
        userId: req.user._id.toString(),
      })
        .then(() => {
          res.json({ msg: 'success' });
        })
        .catch(err => {
          next(err);
        });
    },
  ],
};

controller.commentPost = {
  POST: [
    isAuthenticated,
    body('text').trim().escape().isLength({ min: 1, max: 1024 }),
    (req, res, next) => {
      let userId = req.user._id.toString();
      let postId = req.params.id;

      let text = req.body.text;

      Comment.create({ userId, postId, text })
        .then(newDoc => {
          res.json(newDoc);
        })
        .catch(err => {
          next(err);
        });
    },
  ],
  PUT: [
    isAuthenticated,
    body('text').trim().escape().isLength({ min: 1, max: 1024 }),
    (req, res, next) => {
      let commentId = req.params.commentid;
      let currentUserId = req.user._id.toString();

      let newText = req.body.text;

      Comment.findById(commentId)
        .then(found => {
          if (found.userId.toString() !== currentUserId)
            return next(
              createError(400, "Can't edit other people's comments!")
            );

          return found.update({ text: newText }).then(() => res.json(text));
        })
        .catch(err => {
          next(err);
        });
    },
  ],
  GET: [
    isAuthenticated,
    (req, res, next) => {
      Comment.find({ postId: req.params.id })
        .populate('userId')
        .then(comments => {
          res.json(comments);
        })
        .catch(err => {
          next(err);
        });
    },
  ],
  DELETE: [
    isAuthenticated,
    (req, res, next) => {
      let commentId = req.params.commentid;

      let currentUser = req.user._id.toString();

      Comment.findById(commentId)
        .then(found => {
          if (found.userId.toString() !== currentUser)
            return next(
              createError(400, "Can't delete other people's comments!")
            );

          return found
            .deleteOne()
            .then(() =>
              res.json({ msg: 'Successfully removed comment', status: true })
            );
        })
        .catch(err => {
          next(err);
        });
    },
  ],
};

controller.post = {
  GETFeed: [
    isAuthenticated,
    async (req, res, next) => {
      let currentUserId = req.user._id.toString();

      let response = await axios.get(
        `http://localhost:${
          process.env.PORT || '3000'
        }/api/user/${currentUserId}/friends`
      );
      let friends = response.data.friends;

      Post.find({
        author: {
          $in: friends,
        },
      })
        .sort('-createdAt')
        .then(feed => {
          res.json({ feed });
        })
        .catch(err => {
          return next(err);
        });
    },
  ],
  POST: [
    isAuthenticated,
    body('text').trim().escape().isLength({ min: 1, max: 1024 }),
    (req, res, next) => {
      let authorId = req.user._id.toString();
      let textForNewPost = req.body.text;

      Post.create({ author: authorId, text: textForNewPost })
        .then(newDoc => {
          res.json(newDoc);
        })
        .catch(err => {
          next(err);
        });
    },
  ],
  GETOne: [
    isAuthenticated,
    (req, res, next) => {
      let requestedPostId = req.params.id;
      Post.findById(requestedPostId)
        .then(doc => {
          res.json(doc);
        })
        .catch(err => {
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
        .then(posts => res.json(posts))
        .catch(err => next(err));
    },
  ],
  DELETE: [
    isAuthenticated,
    (req, res, next) => {
      let currentUserId = req.user._id.toString();
      let requestedPostId = req.params.id;

      Post.findById(requestedPostId)
        .then(found => {
          if (found.author.toString() !== currentUserId)
            return next(createError(400, "Can't delete other people's posts!"));

          return found
            .deleteOne()
            .then(() =>
              res.json({ msg: 'Successfully removed post', status: true })
            );
        })
        .catch(err => {
          next(err);
        });
    },
  ],
  UPDATE: [
    isAuthenticated,
    body('text').isLength({ min: 1, max: 1024 }).trim().escape(),
    (req, res, next) => {
      let requestedPostId = req.params.id;
      let newText = req.body.text;

      Post.findById(requestedPostId)
        .then(found => {
          if (found.author.toString() !== req.user._id.toString())
            return next(createError(400, "Can't edit other people's posts!"));

          return found.update({ text: newText }).then(() => res.json(newText));
        })
        .catch(err => {
          next(err);
        });
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
    (req, res, next) => {
      let { id } = req.params;

      FriendRequest.find({ $or: [{ from: id }, { to: id }] })
        .then(requests => {
          let friends = [],
            youRequested = [],
            theyRequested = [];

          requests.forEach(request => {
            let hasMirrors = false;

            requests.forEach(requestToCompare => {
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
        .catch(err => {
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
        .then(newDoc => {
          res.json({ status: true, result: newDoc });
        })
        .catch(err => {
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
        .catch(err => {
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
