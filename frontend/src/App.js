import React from 'react';

import { useSelector } from 'react-redux';

import { selectCurrentUser, selectStatus } from './features/auth/authSlice';

function App() {
  let auth = useSelector(selectCurrentUser);
  let authStatus = useSelector(selectStatus);

  return (
    <div className="App">
      <h1>Auth Status: {authStatus}</h1>
      <h2>{auth?.name || 'No user currently logged in.'}</h2>
      <br />
      <br />
      {authStatus === 'fulfilled' && auth ? (
        <a href="/api/auth/logout">Logout</a>
      ) : (
        <a href="/api/auth/github">Login with github</a>
      )}
    </div>
  );
}

export default App;
