import 'firebase/auth';
import React from 'react';
import ReactDOM from 'react-dom';
import { FirebaseAppProvider } from 'reactfire/firebaseApp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cssRule } from 'typestyle';

import { config } from './util/firebase_config';
import App from './components/App';

cssRule('body', {
  margin: 0,
});

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={config}>
      <App />
      <ToastContainer hideProgressBar />
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
