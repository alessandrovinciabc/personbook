import React from 'react';

import Navbar from '../components/Navbar.jsx';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

function LoginPage(props) {
  let auth = useSelector(selectCurrentUser);
  return (
    <>
      <Navbar isLoggedIn={!!auth} title="Login" />
      <div>
        <h1>Login Page</h1>
        <div>
          <a href="/api/auth/github">Login with Github</a>
          <br />
          <a href="/api/auth/google">Login with Google</a>
          <br />
          <a href="/api/auth/facebook">Login with Facebook</a>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
