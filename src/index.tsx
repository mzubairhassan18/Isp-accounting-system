import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {store} from 'store'; // Your Redux store setup
import App from './app';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
