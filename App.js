import React from 'react';


import { Router, Scene } from 'react-native-router-flux';
import firebase from 'firebase';

import Auth from './assets/containers/Auth';
import Login from './assets/containers/Login';
import Mapa from './assets/containers/Map';

export default class App extends React.Component {

  componentWillMount() {
    firebase.initializeApp({
    apiKey: 'AIzaSyC90PabaVp594fe2P_1c89lPCxHle18fJk',
    authDomain: 'mi-circuito-tec.firebaseapp.com',
    databaseURL: 'https://mi-circuito-tec.firebaseio.com',
    projectId: 'mi-circuito-tec',
    storageBucket: 'mi-circuito-tec.appspot.com',
    messagingSenderId: '253965715675'
  });
  }

  render() {
    return (
        <Router>
          <Scene key='root' hideNavBar>
            <Scene 
              key='Auth'
              component={Auth}
              initial
            />
            <Scene 
              key='Login'
              component={Login}
            />
            <Scene 
              key='Mapa'
              component={Mapa}
            />
          </Scene>
        </Router>
    );
  }
}

