import React from 'react';

import { Router, Scene } from 'react-native-router-flux';
import firebase from 'firebase';

import Auth from './assets/containers/Auth';
import Login from './assets/containers/Login';
import Mapa from './assets/containers/Map';

export default class App extends React.Component {

  componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyAVAPbwOH9MMV65z37xJMWt9PqzCO8KgIg',
      authDomain: 'tempusx-b8e56.firebaseapp.com',
      databaseURL: 'https://tempusx-b8e56.firebaseio.com',
      projectId: 'tempusx-b8e56',
      storageBucket: 'tempusx-b8e56.appspot.com',
      messagingSenderId: '988327589724',
  });
  }

  render() {
    console.log('HOLAAAAA');
    return (
        <Router>
          <Scene key='root' hideNavBar>
            <Scene
              key='Auth'
              component={Auth}
              //initial
            />
            <Scene
              key='Login'
              component={Login}
            />
            <Scene
              key='Mapa'
              component={Mapa}
              initial
            />
          </Scene>
        </Router>
    );
  }
}
