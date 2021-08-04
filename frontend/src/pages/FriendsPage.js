import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar.jsx';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectStatus } from '../features/auth/authSlice';
import { selectRelationships } from '../features/friendsSlice.js';

// Components
import Loader from '../components/Loader';
import UserBlock from '../components/UserBlock';

import axios from 'axios';

function FriendsPage(props) {
  let auth = useSelector(selectCurrentUser);
  let status = useSelector(selectStatus);
  let { friends } = useSelector(selectRelationships);
  let [users, setUsers] = useState([]);

  useEffect(() => {
    if (friends.length === 0) return;
    let fetchAndSetState = async () => {
      let fetchedFriends = friends.map((friend) =>
        axios.get(`/api/user/${friend}`)
      );
      Promise.all(fetchedFriends).then((values) => {
        let friendsAsObjects = values.map((value) => value.data);

        setUsers(friendsAsObjects);
      });
    };
    fetchAndSetState();
  }, [friends]);

  function onFriendAdd(idOfRequestedFriend) {
    return axios.post(`/api/user/${auth._id}/friends`, {
      newFriend: idOfRequestedFriend,
    });
  }

  function onFriendDelete(idOfFriendToRemove) {
    return axios.delete(`/api/user/${auth._id}/friends/${idOfFriendToRemove}`);
  }

  function displayUsers() {
    if (users.length === 0) return;

    return users.map((user) => (
      <UserBlock
        key={user._id}
        user={user}
        friendOps={{ onFriendDelete, onFriendAdd }}
      />
    ));
  }

  return (
    <>
      <Navbar isLoggedIn={true} title="Friends" />
      <br />
      <br />
      {status !== 'fulfilled' ? <Loader /> : displayUsers()}
    </>
  );
}

export default FriendsPage;
