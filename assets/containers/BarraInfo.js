import {Text, View} from 'react-native';
import React, { Component } from 'react';
import {Col, Grid, Icon } from 'native-base';

export default class Barra extends React.Component {
    render() {
        return(
            <View style={styles.barra}>
            <Grid>
                <Col style={{ backgroundColor: 'rgba(0,0,0,0)'}}>
                    <Icon name='md-bus' style={styles.icono} /> 
                </Col>
                <Col style={{ backgroundColor: 'rgba(0,0,0,0)'}}>
                    <Text style={styles.texto}> Ruta 1 </Text>
                </Col>
                <Col style={{ backgroundColor: 'rgba(0,0,0,0)'}}>
                    <Icon name='ios-hand' style={styles.icono} />
                </Col>
                <Col style={{ backgroundColor: 'rgba(0,0,0,0)'}}>
                    <Text style={styles.texto}> Aulas 4 </Text>
                </Col>
                <Col style={{ backgroundColor: 'rgba(0,0,0,0)'}}>
                    <Icon name='md-time' style={styles.icono} />
                </Col>
                <Col style={{ backgroundColor: 'rgba(0,0,0,0)'}}>
                <Text style={styles.texto}> 6 min </Text>
                </Col>
            </Grid>
            </View>
        )
    }
}

const styles = {
    barra: {
        position: 'absolute',
        backgroundColor: 'white',
        width: '90%',
        left: '5%',
        top: '6%',
        height: 45,
        borderRadius: 7,
        shadowColor: '#151515',
        shadowOffset: {width: 10, height: 10},
        shadowOpacity: 0.4,
    },
    icono: {
        left: '8%',
        top: '18%',
        color: 'black',
    },

    texto: {
        fontSize: 16,
        left: '-15%',
        top: '30%',
        color: 'black',
        fontWeight: '300'
    }
};