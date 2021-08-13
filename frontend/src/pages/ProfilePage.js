import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar.jsx';

// Components
import Loader from '../components/Loader';
import Post from '../components/Post';
import PostForm from '../components/PostForm';

import axios from 'axios';

import { useParams } from 'react-router-dom';

function ProfilePage({ userId }) {
  //If no prop is passed, then use the
  //parameter from the router
  let { id } = useParams();
  let userToFetch = userId || id;

  let [userStatus, setUserStatus] = useState('idle');
  let [user, setUser] = useState(null);

  let [numberOfFriends, setNumberOfFriends] = useState(0);
  let [numberStatus, setNumberStatus] = useState('idle');

  let [posts, setPosts] = useState([]);

  useEffect(() => {
    if (userToFetch == null) return;
    if (userStatus !== 'idle') return;

    setUserStatus('pending');

    let fetchUserAndSetState = async () => {
      axios
        .get(`/api/user/${userToFetch}`)
        .then((response) => {
          if (response.data._id.toString() == null) return;
          setUser(response.data);
          setUserStatus('fulfilled');
        })
        .catch((err) => {
          setUserStatus('rejected');
        });
    };

    fetchUserAndSetState();
  }, [userToFetch, userStatus]);

  useEffect(() => {
    if (user == null) return;
    if (numberStatus !== 'idle') return;
    setNumberStatus('pending');

    axios
      .get(`/api/user/${userToFetch}/friends`)
      .then((response) => {
        setNumberOfFriends(response.data.friends.length);
        setNumberStatus('fulfilled');
      })
      .catch((err) => {
        setNumberStatus('rejected');
      });
  }, [user, userToFetch, numberStatus]);

  useEffect(() => {
    if (user == null) return;

    axios.get(`/api/user/${userToFetch}/post`).then((response) => {
      setPosts(response.data);
    });
  }, [user, userToFetch]);

  return (
    <>
      <Navbar isLoggedIn={true} title="Profile" />
      <br />
      <br />
      <div>
        {user && (
          <>
            {user.name} {user._id}
          </>
        )}
      </div>
      {numberStatus !== 'fulfilled' ? (
        <Loader />
      ) : (
        <div>
          {numberOfFriends} {numberOfFriends === 1 ? 'friend' : 'friends'}
          <br />
          Posts: {posts.length}
          <br />
          <br />
          <PostForm
            onConfirm={() => {
              setUserStatus('idle');
            }}
          />
          <br />
          <br />
          {posts.map((post) => (
            <Post key={post._id} data={post} />
          ))}
        </div>
      )}
    </>
  );
}

export default ProfilePage;
