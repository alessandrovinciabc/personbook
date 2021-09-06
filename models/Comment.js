const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const CommentSchema = new Schema(
  {
    userId: { type: ObjectId, ref: 'User' },
    postId: ObjectId,
    text: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
