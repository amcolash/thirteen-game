import firebase from 'firebase/app';
import React from 'react';
import { HelpCircle } from 'react-feather';
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
          provider.addScope('email');
          auth.signInWithPopup(provider);
        }}
      >
        <img src="/signin-google.png" alt="Sign in with Google" />
      </button>
      <br />
      <button style={{ background: 'white', border: 'none', padding: 8, borderRadius: 2 }} onClick={() => auth.signInAnonymously()}>
        <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontWeight: 'bold' }}>
          <HelpCircle />
          <span style={{ marginLeft: 16 }}>Sign In Anonymously</span>
        </div>
      </button>
    </div>
  );
};

export default SignIn;
