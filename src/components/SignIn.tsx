import firebase from 'firebase/app';
import React from 'react';
import { useAuth } from 'reactfire';

const SignIn = () => {
  const auth = useAuth();

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Thirteen</h1>
      <button
        style={{ background: 'none', border: 'none' }}
        onClick={() => {
          const provider = new firebase.auth.GoogleAuthProvider();
          provider.addScope('profile');
          provider.addScope('email');

          auth.signInWithPopup(provider);
        }}
      >
        <img src="/signin-google.png" alt="Sign in with Google" />
      </button>
    </div>
  );
};

export default SignIn;
