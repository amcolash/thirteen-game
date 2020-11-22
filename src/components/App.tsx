import { FirebaseAuthConsumer } from '@react-firebase/auth';
import React from 'react';
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

export default class App extends React.Component {
  render() {
    return (
      <FirebaseAuthConsumer>
        {({ isSignedIn }) => <div className={appStyle}>{isSignedIn ? <Rooms /> : <SignIn />}</div>}
      </FirebaseAuthConsumer>
    );
  }
}
