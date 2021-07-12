const User = require('../models/User');

const passport = require('passport');

const GithubStrategy = require('passport-github2').Strategy;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

let ranOnce = false;
function setup(req, res, next) {
  if (ranOnce) return next();
  let port = process.env.PORT || '3000';
  const CALLBACK_URL = `${req.protocol}://${req.hostname}:${port}/api/auth/github/callback`;

  // Strategies
  passport.use(
    'github',
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        CALLBACK_URL,
      },
      async (token, refreshToken, profile, done) => {
        let userFromDB;
        let { displayName, nodeId } = profile;

        try {
          /* Find existing account */
          userFromDB = await User.findOne({
            authId: { provider: 'github', value: profile.nodeId },
          });

          if (userFromDB) {
            return done(null, userFromDB);
          }

          /* Create new account */
          let newUser = await User.create({
            name: displayName,
            authId: {
              provider: 'github',
              value: nodeId,
            },
          });

          done(null, newUser);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  ranOnce = true;
  next();
}

module.exports = setup;
