import firebase from 'firebase/app';
import React from 'react';

import Firebase from '../util/firebase';

// Based on code from: https://medium.com/@wcandillon/integrating-firebase-authentication-with-react-router-in-react-16-3-92f53b67c0b0

const defaultFirebaseContext = {
  Firebase,
  isUserSignedIn: false,
};

export const FirebaseContext = React.createContext(defaultFirebaseContext);

type FirebaseProviderState = {
  Firebase: firebase.app.App;
  authStatusReported: boolean;
  isUserSignedIn: boolean;
};

export default class FirebaseProvider extends React.Component<{}, FirebaseProviderState> {
  state = { ...{ ...defaultFirebaseContext, authStatusReported: false } };

  componentDidMount() {
    Firebase.auth().onAuthStateChanged((user) =>
      this.setState({
        authStatusReported: true,
        isUserSignedIn: !!user,
      })
    );
  }

  render(): React.ReactNode {
    const { children } = this.props;
    const { authStatusReported, isUserSignedIn } = this.state;
    return <FirebaseContext.Provider value={{ Firebase, isUserSignedIn }}>{authStatusReported && children}</FirebaseContext.Provider>;
  }
}
