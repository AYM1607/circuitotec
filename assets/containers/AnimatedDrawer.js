import React, { Component } from 'react';
import { 
    Animated, 
    View, 
    PanResponder,
    Dimensions,
} from 'react-native';
import { Text, Icon } from 'native-base';

import ContenidoGesture from './ContenidoGesture';

//constant that indicates the height of the screen
const SCREEN_HEIGHT = Dimensions.get('window').height;
//constant that indicates the threshold fro moving the drawer 
const SWIPE_THRESHOLD = 0.20 * SCREEN_HEIGHT;

export default class AnimatedDrawer extends Component {
    constructor(props) {
        super(props);
        //create a position objcet
        const position = new Animated.ValueXY();
        //create a panresponder object
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                if (gesture.dy > 50 || gesture.dy < -50) {
                    position.setValue({ x: 0, y: gesture.dy });
                }
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dy < -SWIPE_THRESHOLD) {
                    this.forceUp();
                } else if (gesture.dy > SWIPE_THRESHOLD * (3 / 2)) {
                    this.resetPosition();
                } else if (gesture.dy > 30 || gesture.dy < -30) {
                    this.resetPosition();
                }
            }
        });

        this.state = { panResponder, position, iconName: 'ios-arrow-up' };
    }

    forceUp() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: -SCREEN_HEIGHT / 3 }
        }).start();
        this.setState({ iconName: 'ios-arrow-down' });
    }

    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0},
        }).start();
        this.setState({ iconName: 'ios-arrow-up' });
    }

    render() {
        return (
            <Animated.View
                {...this.state.panResponder.panHandlers}
                style={{ ...this.state.position.getLayout(), ...styles.drawer }}
            >
                <View style={styles.shadow}>
                    <Icon style={styles.icon} name={this.state.iconName} />
                    <ContenidoGesture />
                </View>
            </Animated.View>
        );
    }
}

const styles = {
    icon: {
        alignSelf: 'center',
        color: '#ddd'
    },
    drawer: {
        borderRadius: 7,
        position: 'absolute',
        backgroundColor: '#fff',
        marginRight: '4%',
        marginLeft: '4%',
        width: '92%',
        height: '80%',
        marginTop: '160%',
    }, 
    shadow: {
        shadowColor: '#222',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        borderRadius: 7,
        height: '100%',
    }
};
