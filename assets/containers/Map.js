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

    this.state = { fontLoaded: false, isInitial: true, camPast: {}, cam: {}, time: 0, userPos: 0, polyline: [] };
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
    const busPos = this.getBusPosition();
      busPos.then((data) => {
        const pos = this.nearestPoint(data._lat, data._long);
        pos.then((mipos) => {
          const time = this.getRealTime(mipos, this.state.userPos);
          time.then((mari) => {
            console.log('pos ='+this.state.userPos);
            //console.log(mari);
              this.setState({ time: Math.round(mari / 60) + '\ mins' });
          });
        });
      });
    
    const userPos = this.getUserPosition();
    userPos.then((data) => {
      const pos = this.nearestPoint(data._lat, data._long);
      pos.then((mipos)=>{
        this.setState({userPos: mipos});
      });
    });

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

 // Returns url ready to send a get request with cors
 getUrl(startCoord, finalCoord) {
  const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial';
  const key = 'AIzaSyBMEL1rK_YlB9GEECQW10u_-i7tP6Fmj8w';
  return url + '&origins=' + startCoord.lat + ',' + startCoord.lng + '&destinations=' + finalCoord.lat + ',' + finalCoord.lng + '&key=' + key;
}

// Returns the time value from json
getTime(url) {
  return fetch(url)
  .then(response => response.json())
  .then(jsondata => jsondata.rows[0].elements[0].duration.value);
}

writePolyline() {
  const polyline = [{ lat: 25.65086, lng: -100.29155 }, { lat: 25.6506, lng: -100.29157 }, { lat: 25.65057, lng: -100.29166 }, { lat: 25.65095, lng: -100.29193 }, { lat: 25.65135, lng: -100.29214 }, { lat: 25.65163, lng: -100.29222 }, { lat: 25.65188, lng: -100.29192 }, { lat: 25.65201, lng: -100.29175 }, { lat: 25.65237, lng: -100.29129 }, { lat: 25.65271, lng: -100.29087 }, { lat: 25.6531, lng: -100.29039 }, { lat: 25.65356, lng: -100.28982 }, { lat: 25.65367, lng: -100.28887 }, { lat: 25.65376, lng: -100.28808 }, { lat: 25.65383, lng: -100.28729 }, { lat: 25.65379, lng: -100.28644 }, { lat: 25.65359, lng: -100.28571 }, { lat: 25.65338, lng: -100.2852 }, { lat: 25.65318, lng: -100.2847 }, { lat: 25.653, lng: -100.28416 }, { lat: 25.65288, lng: -100.28352 }, { lat: 25.65273, lng: -100.2829 }, { lat: 25.6526, lng: -100.28238 }, { lat: 25.65251, lng: -100.28196 }, { lat: 25.65239, lng: -100.28148 }, { lat: 25.65226, lng: -100.28095 }, { lat: 25.65228, lng: -100.28038 }, { lat: 25.65238, lng: -100.27978 }, { lat: 25.65255, lng: -100.2791 }, { lat: 25.65268, lng: -100.27847 }, { lat: 25.65281, lng: -100.27767 }, { lat: 25.65317, lng: -100.27631 }, { lat: 25.65316, lng: -100.27637 }, { lat: 25.65308, lng: -100.27697 }, { lat: 25.65329, lng: -100.27718 }, { lat: 25.65389, lng: -100.2776 }, { lat: 25.65468, lng: -100.2782 }, { lat: 25.65538, lng: -100.27886 }, { lat: 25.65628, lng: -100.27952 }, { lat: 25.65728, lng: -100.28028 }, { lat: 25.65816, lng: -100.28091 }, { lat: 25.65883, lng: -100.2814 }, { lat: 25.65941, lng: -100.28179 }, { lat: 25.66024, lng: -100.28217 }, { lat: 25.66019, lng: -100.28318 }, { lat: 25.66016, lng: -100.28399 }, { lat: 25.65967, lng: -100.284 }, { lat: 25.65906, lng: -100.28401 }, { lat: 25.6585, lng: -100.28403 }, { lat: 25.65778, lng: -100.28405 }, { lat: 25.6573, lng: -100.28406 }, { lat: 25.65661, lng: -100.28408 }, { lat: 25.65558, lng: -100.28409 }, { lat: 25.65464, lng: -100.28411 }, { lat: 25.65373, lng: -100.2841 }, { lat: 25.65308, lng: -100.28412 }, { lat: 25.65241, lng: -100.28435 }, { lat: 25.65183, lng: -100.28482 }, { lat: 25.65138, lng: -100.28542 }, { lat: 25.65086, lng: -100.28613 }, { lat: 25.65042, lng: -100.28669 }, { lat: 25.65003, lng: -100.28722 }, { lat: 25.64958, lng: -100.28782 }, { lat: 25.64903, lng: -100.28854 }, { lat: 25.64864, lng: -100.28907 }, { lat: 25.64825, lng: -100.28957 }, { lat: 25.64793, lng: -100.29001 }, { lat: 25.64816, lng: -100.29015 }, { lat: 25.64871, lng: -100.29049 }, { lat: 25.64942, lng: -100.29096 }, { lat: 25.64969, lng: -100.29123 }, { lat: 25.65, lng: -100.29143 }, { lat: 25.65026, lng: -100.29159 }, { lat: 25.65072, lng: -100.29149 }];
  const db = firebase.firestore();
  db.doc('Ruta Revolucion/Polyline').set(
      { polyline }
  ).then(() => {
      console.log('Data saved!');
  }).catch((error) => {
    console.error('Error adding document: ', error);
  });
}

writeTimes() {
  const array = [];
  let time;
  const db = firebase.firestore();
  db.doc('Ruta Revolucion/Polyline').get()
    .then((doc) => {
      if (doc && doc.exists) {
        const myData = doc.data();
        for (let i = 0; i < myData.polyline.length - 1; i++) {
          const url = this.getUrl(myData.polyline[i], myData.polyline[i + 1]);
          time = this.getTime(url);
          time.then((result) => {
            array.push(result);
            if (array.length === 73) {
              db.doc('Ruta Revolucion/Time').set(
                  { array }
              ).then(() => {
                  console.log('Data saved!');
              }).catch((error) => {
                console.error('Error adding document: ', error);
              });
            }
          });
        }
      }
    })
    .catch(() => {
      console.log('Got and error');
    });
}

getTotalTime() {
  const db = firebase.firestore();
  db.doc('Ruta Revolucion/Time').get()
  .then((doc) => {
    if (doc && doc.exists) {
      const myData = doc.data();
      let total = 0;
      for (let i = 0; i < myData.array.length; i++) {
        total += myData.array[i];
      if (i === myData.array.length - 1)
        console.log(total);
      }
    }
  }).catch(() => {
    console.log('Got an error');
  });
}

nearestPoint(lat, lng) {
  const db = firebase.firestore();
  return db.doc('Ruta Revolucion/Polyline').get()
  .then((doc) => {
    const polyline = doc.data().polyline;
    let minimum = 1;
    let index = 0;
    let substract;
    for (let i = 0; i < polyline.length; i++) {
      substract = Math.abs((polyline[i].lat - lat)) + Math.abs((polyline[i].lng - lng));
      if (substract < minimum) {
        minimum = substract;
        index = i;
      }
    }
    return index;
  })
  .catch(() => {
    console.log('Hubo un error');
  });
}

getRealTime(bus, location){
  const db = firebase.firestore();
  return db.doc('Ruta Revolucion/Time').get()
  .then((doc) => {
    const times = doc.data().array;
    let totalTime = 0;
    if (bus < location) {
      for (let i = bus; i < location; i++) {
        totalTime += times[i];
      }
    } else {
      for (let i = 0; i < location; i++) {
        totalTime += times[i];
      }
      for (let i = bus; i < times.length; i++) {
        totalTime += times[i];
      }
    }
    return totalTime;
  })
  .catch();
}

getBusPosition() {
  const db = firebase.firestore();
  return db.doc('cam/1').get()
  .then((doc) => {
    return doc.data().pos;
  });
}

getUserPosition() {
  const db = firebase.firestore();
  return db.doc('cam/persona').get()
  .then((doc) => {
    return doc.data().pos;
  });
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
                {this.state.fontLoaded ? <BarraInfo tiempo={this.state.time} /> : null}
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
