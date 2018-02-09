import React, { Component } from 'react';
import { Dimensions, View, Image } from 'react-native';
import { Container, Header, Left, Right, Button, Icon, Text, Body, Grid, Col } from 'native-base';
import RutaHospitales from '../RutaHospitales.jpg';
import RutaRevolucion from '../RutaRevolucion.jpg';
import RutaGarzaSada from '../RutaGarzaSada.jpg';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class ContenidoGesture extends React.Component {

    state = {count: 1, imagen: RutaHospitales, texto: 'Ruta Hospitales'};

    lista () {
        let i = this.state.count + 1;
        let image;
        let ruta;

        if (i > 3){
            i = 1; 
        }
        else if (i < 1){
            i = 3;
        }
        switch (i) {
            case 1:
                image = RutaHospitales;
                ruta = 'Ruta Hospitales';
                break;
            case 2:
                image = RutaRevolucion;
                ruta = 'Ruta Revolucion';
                break;
            case 3:
                image = RutaGarzaSada;
                ruta = 'Ruta Garza Sada';
                break;
        }
        this.setState({count: i, imagen: image, texto: ruta});
    }

    lista2 () {
        let i = this.state.count - 1;
        let image;
        let ruta;

        if (i > 3){
            i = 1; 
        }
        else if (i < 1){
            i = 3;
        }
        switch (i) {
            case 1:
                image = RutaHospitales;
                ruta = 'Ruta Hospitales';
                break;
            case 2:
                image = RutaRevolucion;
                ruta = 'Ruta Revolucion';
                break;
            case 3:
                image = RutaGarzaSada;
                ruta = 'Ruta Garza Sada';
                break;
        }
        this.setState({count: i, imagen: image, texto: ruta});
    }

    render() {

        const { Posicion, Icono, Colo, bRight, bLeft, Texto, Colo1 } = styles;

        return (
            <View style={Posicion}>
                <Grid>
                    <Col size={1} style={Colo}>
                        <Button transparent onPress={this.lista.bind(this)} style={bLeft} >
                            <Icon name='ios-arrow-back-outline' style={Icono} />
                        </Button>
                    </Col>
                    <Col size={5} style={Colo1} >
                        <Text style={Texto}> {this.state.texto} </Text>
                        <Image 
                            style={styles.imageStyle}
                            source={this.state.imagen} />
                    </Col>
                    <Col size={1} style={Colo}>
                        <Button transparent onPress={this.lista2.bind(this)} style={bRight} >
                            <Icon name='ios-arrow-forward-outline' style={Icono} />
                        </Button>
                    </Col>
                </Grid>
            </View>

        );
    }
}

const styles = {
    Posicion: {
        justifyContent: 'center',
        marginTop: 15,
        backgroundColor: 'white',
        height: SCREEN_HEIGHT / 3,
        width: '100%',
        borderBottomWidth: 0,
    },
    Icono: {
        color: 'black',
    },
    Colo: {
        justifyContent: 'center',
    },
    bRight: {
        alignSelf: 'flex-end'
    },
    bLeft: {
        alignSelf: 'flex-start'
    },
    imageStyle: {
        width: '100%',
        alignSelf: 'center',
        borderRadius: 20,
        resizeMode: 'contain',
        borderColor: '#BDBDBD',
        marginTop: -55
    },
    Texto: {
        fontSize: 22,
        fontWeight: '300',
        textAlign: 'center',
        marginTop: 35
    },
    Colo1: {
        justifyContent: 'center',
        flexDirection: 'column',
    }
};