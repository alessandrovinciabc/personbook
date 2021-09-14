const express = require('express');
const router = express.Router();

const controller = require('../controllers/apiController');

router.get('/user', controller.user.GET);
router.put('/user', controller.account.PUT);
router.get('/user/:id', controller.specificUser.GET);

router
  .route('/user/:id/friends')
  .get(controller.friends.GET)
  .post(controller.friends.POST);
router.delete('/user/:id/friends/:friendid', controller.friends.DELETE);

/* Posts */
router.post('/post', controller.post.POST);
router.get('/post/:id', controller.post.GETOne);
router.get('/user/:id/post', controller.post.GETAll);
router.delete('/post/:id', controller.post.DELETE);
router.put('/post/:id', controller.post.UPDATE);

/* Likes */
router
  .route('/post/:id/like')
  .get(controller.likePost.GET)
  .post(controller.likePost.POST)
  .delete(controller.likePost.DELETE);

/*Comments */
router
  .route('/post/:id/comment')
  .get(controller.commentPost.GET)
  .post(controller.commentPost.POST);
router
  .route('/post/:id/comment/:commentid')
  .put(controller.commentPost.PUT)
  .delete(controller.commentPost.DELETE);

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
