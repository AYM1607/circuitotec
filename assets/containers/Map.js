import React from 'react';
import { StyleSheet, View, StatusBar, Image, Keyboard, __spread } from 'react-native';
import Expo, { MapView } from 'expo';
import { Container, Button, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import 'firebase/firestore';

import car from '../Imagen2.png';
import AnimatedDrawer from './AnimatedDrawer';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('cam');
    this.unsubscribe = null;

    this.state = { fontLoaded: false, cam: {} };
  }

  async componentWillMount() {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
      });
      this.setState({ fontLoaded: true });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate); 
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (query) => {
    query.forEach((doc) => {
      //console.log(doc.data().pos['_lat']);
      this.setState({ cam: { ...this.state.cam, 
        [doc.data().id]: { 
          id: doc.data().id,
          lat: doc.data().pos['_lat'],
          long: doc.data().pos['_long'],
      } }
    });
    });

    this.setState({ carsLoaded: true });
    //console.log(this.state.cam);
  }

  renderCars() {
   // if (Object.keys(this.state.cam).length > 0) {

    const arr = Object.keys(this.state.cam).map((key) => { return this.state.cam[key]; });
    if (arr.length > 0) {
      return arr.map((item) => {
        return (
          <MapView.Marker
            coordinate={{ latitude: item.lat,
            longitude: item.long, }}
          >
            <Image ref='image' style={styles.markerStyle} source={car} />
          </MapView.Marker>
        );
      });
    }
    return null;
  }
    

  render() {
    Keyboard.dismiss();
    return (
          this.state.carsLoaded ? (
            <Container>
              <StatusBar
                barStyle="dark-content"
              />
              <MapView
              loadingEnabled
              rotateEnabled={false}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 25.649173,
                longitude: -100.289758,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              >
                {this.renderCars()}
              </MapView>
                {this.state.fontLoaded ? <AnimatedDrawer /> : null}
             </Container>
          ) : null
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0039A6',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  button: {
    marginLeft: '4%',
    marginRight: '4%',
    marginTop: '2%',
  },
  markerStyle: {
    width: 34,
    height: 14,
    transform: [
      { rotate: '0deg' }
    ]
  }

});
