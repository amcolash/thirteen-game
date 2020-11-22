import firebase from 'firebase/app';
import 'firebase/auth';
import { FirebaseAuthProvider } from '@react-firebase/auth';
import { FirebaseDatabaseProvider } from '@react-firebase/database';
import React from 'react';
import ReactDOM from 'react-dom';
import { cssRule } from 'typestyle';

import App from './components/App';
import { config } from './util/firebase_config';

cssRule('body', {
  margin: 0,
});

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAuthProvider firebase={firebase} {...config}>
      <FirebaseDatabaseProvider firebase={firebase} {...config}>
        <App />
      </FirebaseDatabaseProvider>
    </FirebaseAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
