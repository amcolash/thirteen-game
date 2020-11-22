import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';

export default class SignIn extends React.Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Thirteen</h1>
        <button
          style={{ background: 'none', border: 'none' }}
          onClick={() => {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');

            firebase.auth().signInWithPopup(provider);
          }}
        >
          <img src="/signin-google.png" alt="Sign in with Google" />
        </button>
      </div>
    );
  }
}
