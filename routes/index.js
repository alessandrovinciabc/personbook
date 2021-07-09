const express = require('express');
const router = express.Router();

const STATIC_FOLDER = require('../util/static');

/* Always re-route to main file */
router.get('/', function (req, res) {
  res.sendFile('./index.html', { root: STATIC_FOLDER });
});

module.exports = router;
