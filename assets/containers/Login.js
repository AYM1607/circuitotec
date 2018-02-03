import Expo from 'expo';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
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

export default class App extends React.Component {

  async componentWillMount() {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
    });
  }

  state = { email: '', password: '', error: '', loading: false }

  onButtonPress() {
    const { email, password } = this.state;
    this.setState({ error: '', loading: true });
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(this.onSuccess.bind(this), this.onLoginFailure.bind(this));
  }

  onSuccess() {
    this.setState({
      email: '',
      password: '',
      error: '',
      loading: false,
    });
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
            <Label style={{color: 'white'}}>Email</Label>
            <Input
              autoCorrect={false}
              autoCapitalization={false}
              style={{ color: 'white'}}
              value={this.state.email}
              onChangeText={text => this.setState({ email: text })}
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
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'orange',
  },

};
