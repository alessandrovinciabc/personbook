import React from 'react';

import { useSelector } from 'react-redux';

import { selectCurrentUser, selectStatus } from './features/auth/authSlice';

function App() {
  let auth = useSelector(selectCurrentUser);
  let provider = auth ? auth.authId.provider : 'None';
  let authStatus = useSelector(selectStatus);

  return (
    <div className="App">
      <h1>
        Auth Status: {authStatus} - Provider: {provider}
      </h1>
      <h2>{auth?.name || 'No user currently logged in.'}</h2>
      <br />
      <br />
      {authStatus === 'fulfilled' && auth ? (
        <a href="/api/auth/logout">Logout</a>
      ) : (
        <>
          <a href="/api/auth/github">Login with Github</a>
          <br />
          <a href="/api/auth/google">Login with Google</a>
        </>
      )}
    </div>
  );
}

export default App;
