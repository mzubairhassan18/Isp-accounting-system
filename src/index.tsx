import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {store} from 'store'; // Your Redux store setup
import App from './app';
import { BrowserRouter as Router} from 'react-router-dom';

ReactDOM.render(
  <Provider store={store}>
    <Router>
    <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
