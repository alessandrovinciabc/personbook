import React from 'react';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectStatus } from './features/auth/authSlice';

// Components
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Page404 from './pages/Page404';
import UserListPage from './pages/UserListPage';
import FriendsPage from './pages/FriendsPage';
import PendingPage from './pages/PendingPage';
import ProfilePage from './pages/ProfilePage';

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

        <Route path="/404" exact>
          <Page404 />
        </Route>

        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/users" exact>
          <UserListPage />
        </Route>
        <Route path="/friends" exact>
          <FriendsPage />
        </Route>
        <Route path="/friends/pending" exact>
          <PendingPage />
        </Route>
        <Route path="/profile" exact>
          <ProfilePage userId={auth?._id.toString()} />
        </Route>
        <Route path="/profile/:id" exact>
          <ProfilePage userId={auth?._id.toString()} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
