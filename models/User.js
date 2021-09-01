const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: String,
    profilePicture: String,
    authId: {
      provider: String,
      value: String,
    },
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
