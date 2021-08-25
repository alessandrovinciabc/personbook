const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const CommentSchema = new Schema({
  userId: ObjectId,
  postId: ObjectId,
  text: String,
});

module.exports = mongoose.model('Comment', CommentSchema);
