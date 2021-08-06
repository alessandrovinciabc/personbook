const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const PostSchema = new Schema(
  {
    author: ObjectId,
    text: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
