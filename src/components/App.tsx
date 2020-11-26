import React, { Suspense } from 'react';
import { AuthCheck } from 'reactfire/auth';
import { cssRule, style } from 'typestyle';
import { backgroundColor, textColor } from '../util/data';

import Rooms from './Rooms';
import SignIn from './SignIn';

const appStyle = style({
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',

  background: backgroundColor,
  color: textColor,
  textShadow: '1px 1px black',
  fontFamily: 'sans-serif',
  userSelect: 'none',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

cssRule('button, input', {
  margin: 5,
  padding: 8,
  fontSize: 14,
  background: '#eee',
  color: '#333',
  border: '2px solid #555',
  borderRadius: 5,
  transition: 'all 0.5s',
});

cssRule('button:not(:disabled):hover, input:not(:disabled):hover', {
  borderColor: '#333',
  background: '#bdb',
  boxShadow: '0 0 5px rgba(0,0,0,0.2)',
});

cssRule('button:disabled, input:disabled', {
  background: '#bbb',
  color: '#777',
});

const App = () => {
  return (
    <div className={appStyle}>
      <Suspense fallback={<h1>Signing In...</h1>}>
        <AuthCheck fallback={<SignIn />}>
          <Rooms />
        </AuthCheck>
      </Suspense>
    </div>
  );
};

export default App;
