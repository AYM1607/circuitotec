import React from 'react';
import { StyleSheet, View, StatusBar, Image } from 'react-native';
import Expo, { MapView } from 'expo';
import { Container, Button, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';

import car from '../Imagen2.png';

export default class App extends React.Component {

  async componentWillMount() {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
    });
  }

  render() {
    const style = {
      width: 34,
      height: 14,
      transform: [
        { rotate: '0deg' }
      ]
    };

    return (
      <Container>
        <StatusBar
          barStyle="dark-content"
        />
        <MapView
        rotateEnabled={false}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        >
       <MapView.Marker
        coordinate={{ latitude: 37.78825,
          longitude: -122.4324, }}
        rotation={120.0}
       >
       <Image ref='image' style={style} source={car} />
       </MapView.Marker>
       </MapView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0039A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginLeft: '4%',
    marginRight: '4%',
    marginTop: '2%',
  },

});
