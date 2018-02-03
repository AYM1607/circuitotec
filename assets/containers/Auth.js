import React from 'react';
import { Platform, StyleSheet, View, StatusBar, Image } from 'react-native';
import Expo from 'expo';
import { Container, Button, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';


import busImage from '../bus.png';

export default class App extends React.Component {

  state = { fontLoaded: false};

  async componentWillMount() {
        await Expo.Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
      });
  this.setState({ fontLoaded: true });
}


  render() {
    return (
      <Container style={styles.container}>
        { this.state.fontLoaded ? (
        <View>
          <StatusBar
            backgroundColor="blue"
            barStyle="light-content"
          />
          <Image
            source={busImage}
            style={styles.imageStyle}
          />
          <Button
            bordered
            light
            block
            style={styles.button}
            onPress={Actions.Login}
          >
            <Text> Iniciar sesión </Text>
          </Button>
          <Button bordered light block style={styles.button}>
            <Text> Registrarse </Text>
          </Button>
        </View>
      ) : null }
      </Container>
    );
  }
}



const styles = {
  container: {
    flex: 1,
    backgroundColor: '#0039A6',
    justifyContent: 'center',
  },
  button: {
    marginLeft: '4%',
    marginRight: '4%',
    marginTop: '2%',
  },
  imageStyle: {
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        width: '60%',
      },
    })
  },
};
