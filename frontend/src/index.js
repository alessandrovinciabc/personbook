import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { store } from './app/store';
import { Provider } from 'react-redux';
import { fetchAccount } from './features/auth/authSlice';

store.dispatch(fetchAccount());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
