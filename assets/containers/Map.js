import React from 'react';
import { StyleSheet, View, StatusBar, Image, Keyboard, __spread } from 'react-native';
import Expo, { MapView } from 'expo';
import { Container, Button, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import 'firebase/firestore';

import car from '../Imagen2.png';
import AnimatedDrawer from './AnimatedDrawer';
import BarraInfo from './BarraInfo';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('cam');
    this.unsubscribe = null;

    this.state = { fontLoaded: false, isInitial: true, camPast: {}, cam: {}, polyline: [] };
  }

  async componentWillMount() {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
      });
      this.setState({ fontLoaded: true });
      firebase.firestore().doc('Ruta Revolucion/Polyline').get().then((doc) => {
        if (doc.exists) {
          const polyline = doc.data().polyline.map((item) => {
            return ({    
                latitude: item.lat,
                longitude: item.lng,
            });
          });
          this.setState({ polyline });
        }
      });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate); 
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (query) => {
    if (this.state.isInitial) {
      query.forEach((doc) => {
        //console.log(doc.data().pos['_lat']);
        this.setState({ camPast: { ...this.state.camPast, 
          [doc.data().id]: { 
            id: doc.data().id,
            lat: doc.data().pos['_lat'],
            long: doc.data().pos['_long'],
            angle: '0deg',
        } }
      });
      });
      this.setState({ cam: this.state.camPast });
    } else {
      query.forEach((doc) => {
        //console.log(doc.data().pos['_lat']);

        const str = this.getAngle(
          this.state.camPast[doc.data().id].long,
          this.state.camPast[doc.data().id].lat, 
          doc.data().pos['_long'], 
          doc.data().pos['_lat'], 
          this.state.camPast[doc.data().id].angle
        );

        this.setState({ cam: { ...this.state.cam, 
          [doc.data().id]: { 
            id: doc.data().id,
            lat: doc.data().pos['_lat'],
            long: doc.data().pos['_long'],
            angle: str,
        } }
      });
      });
      this.setState({ camPast: this.state.cam });
    }
  
    this.setState({ carsLoaded: true, isInitial: false });
    //console.log(this.state.cam);
  }

  getAngle(xi, yi, xf, yf, angle) {
    const angleRad = Math.atan((yf - yi) / (xf - xi)).toFixed(10);
    const dx = (xf - xi);
    const dy = (yf - yi);
    const angleDeg = ((angleRad * 180) / Math.PI).toFixed(10);

    let str = '';

    if (dx === 0 && dy === 0) {
      str = angle;
    } else if (dx === 0 && dy > 0) {
      str = '-90deg';
    } else if (dx > 0 && dy > 0) {
      str = (0 - angleDeg) + 'deg';
    } else if (dx > 0 && dy === 0) {
      str = '0deg';
    } else if (dx > 0 && dy < 0) {
      str = (0 - angleDeg) + 'deg';
    } else if (dx === 0 && dy < 0) {
      str = '90deg';
    } else if (dx < 0 && dy < 0) {
      str = (180 - angleDeg) + 'deg';
    } else if (dx < 0 && dy === 0) {
      str = '180deg';
    } else if (dx < 0 && dy > 0) {
      str = (angleDeg - 90) + 'deg';
    }

    return str;
  }

  renderCars() {
   // if (Object.keys(this.state.cam).length > 0) {

    const arr = Object.keys(this.state.cam).map((key) => { return this.state.cam[key]; });
    if (arr.length > 0) {
      return arr.map((item) => {
        return (
          <MapView.Marker
            key={item.id}
            coordinate={{ latitude: item.lat,
            longitude: item.long, }}
          >
          { item.id === 'persona' ? null : (
            <Image 
              ref='image'
              style={{
                width: 34,
                height: 14,
                transform: [
                  { rotate: item.angle }
                ]
              }} 
              source={car} 
            />
          )}
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
                <MapView.Polyline
                  coordinates={this.state.polyline}
                  strokeColor="#85c1e9" // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={3}
                />
              </MapView>
                {this.state.fontLoaded ? <AnimatedDrawer /> : null}
                {this.state.fontLoaded ? <BarraInfo /> : null}
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
      { rotate: '-21.5175deg' }
    ]
  }

});
