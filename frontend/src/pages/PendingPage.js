import React, { useState, useEffect, useMemo } from 'react';

import Navbar from '../components/Navbar.jsx';

// Redux
import { useSelector } from 'react-redux';
import { selectStatus } from '../features/auth/authSlice';
import { selectRelationships } from '../features/friendsSlice.js';

// Components
import Loader from '../components/Loader';
import UsersList from '../components/UsersList';

import axios from 'axios';

function PendingPage(props) {
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

  return (
    <>
      <Navbar isLoggedIn={true} title="Pending Requests" />
      <br />
      <br />
      {status !== 'fulfilled' ? <Loader /> : <UsersList users={users} />}
    </>
  );
}

export default PendingPage;
