import Expo from 'expo';
import React, { Component } from 'react';
import { StatusBar, Keyboard, Platform, Image} from 'react-native';
import { Container,
         Text,
         Form,
         Item,
         Input,
         Label,
         Button,
         Spinner,
         Icon,
        } from 'native-base';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import busImage from '../bus.png';

export default class App extends React.Component {

  async componentWillMount() {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
    });
  }

  state = { email: '', password: '', nombre: '', matricula: '', error: '', loading: false }

  onButtonPress() {
    const { email, password, nombre, matricula } = this.state;
    this.setState({ error: '', loading: true });
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(this.onSuccess.bind(this), this.onLoginFailure.bind(this));
  }

  onSuccess() {
    this.setState({
      email: '',
      password: '',
      nombre: '',
      matricula: '',
      error: '',
      loading: false,
    });
    Keyboard.dismiss()
    Actions.Mapa();
  }

  onLoginFailure() {
    this.setState({
      email: '',
      password: '',
      error: 'Inténtalo otra vez',
      loading: false,
    });
  }

  onSignupFailure() {
    this.setState({
      email: '',
      password: '',
      error: '¿Ya tienes cuenta?',
      loading: false,
    });
  }

  loginButton() {
    if (this.state.loading) {
      return (
        <Spinner color='rgb(0,122,255)' />
      );
    }

    return (
      <Button
            bordered
            block
            light
            style={styles.button}
            onPress={this.onButtonPress.bind(this)}
      >
        <Text> Iniciar sesión </Text>
      </Button>
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar
          backgroundColor="blue"
          barStyle="light-content"
        />

        <Form style={{ marginTop: '40%', marginRight: '4%' }}>
          <Item floatingLabel>
            <Label style={{color: 'white'}}>Nombre</Label>
            <Input
              autoCorrect={true}
              style={{ color: 'white'}}
              value={this.state.nombre}
              onChangeText={text => this.setState({ nombre: text })}
              autoCapitalize='words'
            />
          </Item>
          <Item floatingLabel>
            <Label style={{color: 'white'}}>Matrícula</Label>
            <Input
              autoCorrect={false}
              style={{ color: 'white'}}
              value={this.state.matricula}
              onChangeText={text => this.setState({ matricula: text })}
              autoCapitalize='none'
            />
          </Item>
          <Item floatingLabel>
            <Label style={{ color: 'white' }}>Password</Label>
            <Input
              secureTextEntry
              autoCorrect={false}
              style={{ color: 'white' }}
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
          </Item>
        </Form>

        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>
        {this.loginButton()}
        <Button
          iconLeft
          transparent
          light
          style={styles.buttonBack}
          onPress={Actions.pop}
        >
            <Icon name='arrow-back' />
            <Text>Atras</Text>
        </Button>
        <Image
          source={busImage}
          style={styles.imageStyle}
        />
      </Container>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#0039A6',
  },
  button: {
    marginLeft: '4%',
    marginRight: '4%',
    marginTop: '2%',
  },
  buttonBack: {
    marginTop: '2%',
    alignSelf: 'center',
  },
  imageStyle: {
    resizeMode: 'contain',
    marginTop: 20,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        width: '60%',
      },
    })
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'orange',
  },

};
