import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar.jsx';

// Redux
import { useSelector } from 'react-redux';
import { selectStatus } from '../features/auth/authSlice';
import { selectRelationships } from '../features/friendsSlice.js';

// Components
import Loader from '../components/Loader';
import UsersList from '../components/UsersList.jsx';

import axios from 'axios';

function FriendsPage(props) {
  let status = useSelector(selectStatus);
  let { friends } = useSelector(selectRelationships);
  let [users, setUsers] = useState([]);

  useEffect(() => {
    let fetchAndSetState = async () => {
      let fetchedFriends = friends.map((friend) =>
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
  }, [friends]);

  return (
    <>
      <Navbar isLoggedIn={true} title="Friends" />
      <br />
      <br />
      {status !== 'fulfilled' ? <Loader /> : <UsersList users={users} />}
    </>
  );
}

export default FriendsPage;
