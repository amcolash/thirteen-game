import 'firebase/auth';
import React from 'react';
import ReactDOM from 'react-dom';
import { cssRule } from 'typestyle';

import App from './components/App';
import { config } from './util/firebase_config';
import { FirebaseAppProvider } from 'reactfire/firebaseApp';

cssRule('body', {
  margin: 0,
});

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={config}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
