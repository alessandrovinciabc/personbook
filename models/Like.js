const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const LikeSchema = new Schema({
  userId: ObjectId,
  postId: ObjectId,
});

module.exports = mongoose.model('Like', LikeSchema);
