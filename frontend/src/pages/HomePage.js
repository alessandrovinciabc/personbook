import React from 'react';

import Navbar from '../components/Navbar.jsx';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectStatus } from '../features/auth/authSlice';

// Components
import Loader from '../components/Loader';

function HomePage(props) {
  let auth = useSelector(selectCurrentUser);
  let provider = auth ? auth.authId.provider : 'None';
  let authStatus = useSelector(selectStatus);
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
      </div>
    </>
  );
}

export default HomePage;
