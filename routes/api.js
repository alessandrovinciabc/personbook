const express = require('express');
const router = express.Router();

const controller = require('../controllers/apiController');

router.get('/user', controller.user.GET);
router.get('/user/:id', controller.specificUser.GET);

router
  .route('/user/:id/friends')
  .get(controller.friends.GET)
  .post(controller.friends.POST);
router.delete('/user/:id/friends/:friendid', controller.friends.DELETE);

/* Related to Authentication */
router.get('/account', controller.account.GET);
router.get('/auth/logout', controller.auth.logout.GET);

/* OAuth Paths */
router.get('/auth/github', controller.auth.github.GET);
router.get('/auth/google', controller.auth.google.GET);

/* Callbacks */
router.get('/auth/github/callback', controller.auth.github.callback);
router.get('/auth/google/callback', controller.auth.google.callback);

router.get('/auth/error', controller.auth.error.GET);

module.exports = router;
