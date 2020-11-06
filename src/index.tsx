import React from 'react';
import ReactDOM from 'react-dom';
import { cssRule } from 'typestyle';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

cssRule('body', {
  margin: 0,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
