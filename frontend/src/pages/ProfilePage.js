import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar.jsx';

// Components
import Loader from '../components/Loader';

import axios from 'axios';

function ProfilePage({ userId }) {
  let [userStatus, setUserStatus] = useState('idle');
  let [user, setUser] = useState(null);

  let [numberOfFriends, setNumberOfFriends] = useState(0);
  let [numberStatus, setNumberStatus] = useState('idle');

  useEffect(() => {
    if (userId == null) return;
    if (userStatus !== 'idle') return;

    setUserStatus('pending');

    let fetchUserAndSetState = async () => {
      axios
        .get(`/api/user/${userId}`)
        .then((response) => {
          if (response.data.authId == null) return;
          setUser(response.data);
          setUserStatus('fulfilled');
        })
        .catch((err) => {
          setUserStatus('rejected');
        });
    };

    fetchUserAndSetState();
  }, [userId, userStatus]);

  useEffect(() => {
    if (user == null) return;
    if (numberStatus !== 'idle') return;
    setNumberStatus('pending');

    axios
      .get(`/api/user/${userId}/friends`)
      .then((response) => {
        setNumberOfFriends(response.data.friends.length);
        setNumberStatus('fulfilled');
      })
      .catch((err) => {
        setNumberStatus('rejected');
      });
  }, [user, userId, numberStatus]);

  return (
    <>
      <Navbar isLoggedIn={true} title="Profile" />
      <br />
      <br />
      <div>{user && user.name}</div>
      {numberStatus !== 'fulfilled' ? (
        <Loader />
      ) : (
        <div>
          {numberOfFriends} {numberOfFriends === 1 ? 'friend' : 'friends'}
        </div>
      )}
    </>
  );
}

export default ProfilePage;