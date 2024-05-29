
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'normalize.css';
import './stylesheets/scss/main.scss'

import App from './App.jsx';
import store from './store.js';

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App/>
  </Provider>
);
