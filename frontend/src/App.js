import React from 'react';

import { useSelector } from 'react-redux';

import { selectCurrentUser, selectStatus } from './features/auth/authSlice';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Loader from './components/Loader';
import LoginPage from './pages/LoginPage';

function App() {
  let auth = useSelector(selectCurrentUser);
  let provider = auth ? auth.authId.provider : 'None';
  let authStatus = useSelector(selectStatus);

  return (
    <BrowserRouter>
      <h1>
        Auth Status: {authStatus} - Provider: {provider}
      </h1>
      <h2>{auth?.name || 'No user currently logged in.'}</h2>
      <br />
      {authStatus !== 'fulfilled' && <Loader />}
      <Switch>
        <Route path="/login" exact>
          <LoginPage />
        </Route>

        {authStatus === 'fulfilled' && !auth && <Redirect to="/login" />}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
