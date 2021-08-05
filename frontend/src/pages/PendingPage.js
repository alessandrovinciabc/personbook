import React, { useState, useEffect, useMemo } from 'react';

import Navbar from '../components/Navbar.jsx';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectStatus } from '../features/auth/authSlice';
import { selectRelationships } from '../features/friendsSlice.js';

// Components
import Loader from '../components/Loader';
import UserBlock from '../components/UserBlock';

import axios from 'axios';

function PendingPage(props) {
  let auth = useSelector(selectCurrentUser);
  let status = useSelector(selectStatus);
  let { theyRequested, youRequested } = useSelector(selectRelationships);
  let pending = useMemo(
    () => [...theyRequested, ...youRequested],
    [theyRequested, youRequested]
  );

  let [users, setUsers] = useState([]);

  useEffect(() => {
    let fetchAndSetState = async () => {
      let fetchedFriends = pending.map((friend) =>
        axios.get(`/api/user/${friend}`)
      );
      Promise.all(fetchedFriends).then((values) => {
        let friendsAsObjects = values.map((value) => value.data);

        setUsers((prevUsers) =>
          prevUsers.length === 0 ? friendsAsObjects : prevUsers
        );
      });
    };
    fetchAndSetState();
  }, [pending]);

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
      <Navbar isLoggedIn={true} title="Pending Requests" />
      <br />
      <br />
      {status !== 'fulfilled' ? <Loader /> : displayUsers()}
    </>
  );
}

export default PendingPage;
