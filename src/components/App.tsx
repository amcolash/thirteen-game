import React, { Suspense } from 'react';
import { AuthCheck } from 'reactfire/auth';
import { style } from 'typestyle';

import Rooms from './Rooms';
import SignIn from './SignIn';

const appStyle = style({
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',

  background: '#35654d',
  color: '#ccc',
  textShadow: '1px 1px black',
  fontFamily: 'sans-serif',
  userSelect: 'none',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const App = () => {
  return (
    <div className={appStyle}>
      <Suspense fallback={<h1>Signing In</h1>}>
        <AuthCheck fallback={<SignIn />}>
          <Rooms />
        </AuthCheck>
      </Suspense>
    </div>
  );
};

export default App;
