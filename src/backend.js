import React from 'react';
import ReactDOM from 'react-dom';
import App from './BackendApp';

const elem = document.getElementById('wp-react-dev-app');

if (elem) {
  ReactDOM.render(<App />, elem);
}
