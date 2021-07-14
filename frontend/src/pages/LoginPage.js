import React from 'react';

function LoginPage(props) {
  return (
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
  );
}

export default LoginPage;
