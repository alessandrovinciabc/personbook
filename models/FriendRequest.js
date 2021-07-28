const mongoose = require('mongoose');
const { ObjectId } = mongoose;

const { Schema } = mongoose;

const FriendRequestSchema = new Schema(
  {
    from: ObjectId,
    to: ObjectId,
  },
  { timestamps: true }
);

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);
