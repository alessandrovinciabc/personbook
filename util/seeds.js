//Generate random data for database
const faker = require('faker');

require('dotenv').config();
require('./setupMongoose')();
const Post = require('../models/Post');
const User = require('../models/User');

const N_OF_USERS_TO_GENERATE = 22;

const newUsers = [];
for (let i = 0; i < N_OF_USERS_TO_GENERATE; ++i) {
  let randomName = faker.name.findName();

  newUsers.push({
    name: randomName,
  });
}

User.create(newUsers).then((docs) => {
  docs.forEach((doc) => {
    let randomPostText = faker.lorem.sentence();
    Post.create({ author: doc._id.toString(), text: randomPostText });
  });
});
