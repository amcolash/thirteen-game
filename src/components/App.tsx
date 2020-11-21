import React from 'react';
import { style } from 'typestyle';

import { FirebaseContext } from './FirebaseProvider';
import Game from './Game';
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
      <FirebaseContext.Consumer>
        {({ isUserSignedIn }) => <div className={appStyle}>{isUserSignedIn ? <Game /> : <SignIn />}</div>}
      </FirebaseContext.Consumer>
    );
  }
}
