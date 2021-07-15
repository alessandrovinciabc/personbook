import React from 'react';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectStatus } from './features/auth/authSlice';

// Components
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
  let auth = useSelector(selectCurrentUser);
  let authStatus = useSelector(selectStatus);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact>
          <LoginPage />
        </Route>

        {authStatus === 'fulfilled' && !auth && <Redirect to="/login" />}

        <Route path="/" exact>
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
