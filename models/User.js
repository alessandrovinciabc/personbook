const mongoose = require('mongoose');
const { ObjectId } = mongoose;

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: String,
    authId: {
      provider: String,
      value: String,
    },
    friends: [{ type: ObjectId }],
  },
  { timestamps: true }
);

/*
Features
- Users can send friend requests
- Users can accept/ignore friend requests
- Users have friends
- Max. 100 friends

- Users have posts
*/

module.exports = mongoose.model('User', UserSchema);
