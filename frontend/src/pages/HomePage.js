import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from '../components/Navbar.jsx';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectStatus } from '../features/auth/authSlice';

// Components
import Loader from '../components/Loader';
import Post from '../components/Post';

function HomePage() {
  let auth = useSelector(selectCurrentUser);
  let provider = auth ? auth.authId.provider : 'None';
  let authStatus = useSelector(selectStatus);

  let [feed, setFeed] = useState([]);

  useEffect(() => {
    if (auth == null) return;

    axios.get(`/api/feed`).then(response => {
      setFeed(response.data.feed);
    });
  }, [auth]);

  return (
    <>
      <Navbar isLoggedIn={true} title="Homepage" />
      <div>
        <div>
          <h1>
            Auth Status: {authStatus} - Provider: {provider}
          </h1>
          <h2>{auth?.name}</h2>
          <br />
          {authStatus !== 'fulfilled' && <Loader />}
        </div>
        {feed.map(post => (
          <Post key={post._id} data={post} />
        ))}
      </div>
    </>
  );
}

export default HomePage;
