import React from 'react';
import ReactDOM from 'react-dom';
import { cssRule } from 'typestyle';
import App from './components/App';
import FirebaseProvider from './components/FirebaseProvider';

cssRule('body', {
  margin: 0,
});

ReactDOM.render(
  <React.StrictMode>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
