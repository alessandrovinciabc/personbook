import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from '../components/Navbar.jsx';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectStatus } from '../features/auth/authSlice';

// Components
import Loader from '../components/Loader';
import Post from '../components/Post';

import styled from 'styled-components';

let PageHeader = styled.div`
  margin: 2rem;

  font-weight: bold;
  font-size: 1.3rem;

  justify-content: center;
  display: flex;
`;

let CenteredDiv = styled.div`
  display: flex;
  justify-content: center;

  margin-bottom: 2rem;
`;

function HomePage() {
  let auth = useSelector(selectCurrentUser);
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
          <PageHeader>Welcome back, {auth?.name}!</PageHeader>
          {authStatus !== 'fulfilled' && <Loader />}
          <CenteredDiv>
            {feed.length === 0 && 'Nothing to see here! (yet)'}
          </CenteredDiv>
        </div>
        {feed.map(post => (
          <Post key={post._id} data={post} />
        ))}
      </div>
    </>
  );
}

export default HomePage;
