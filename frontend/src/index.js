import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { store } from './app/store';
import { Provider } from 'react-redux';
import { fetchAccount } from './features/auth/authSlice';

import CSSReset from './Reset.jsx';

store.dispatch(fetchAccount());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <CSSReset />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
