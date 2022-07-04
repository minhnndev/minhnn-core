import React, { Component } from 'react';
import {
    View, StyleSheet, Dimensions, TouchableOpacity,Image
} from 'react-native';
import Colors from '../../../colors';
import { Icons } from '../../../icons';
import Text from '../../typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const KEY_WIDTH = (SCREEN_WIDTH - 2) / 3;
const KEY_HEIGHT = KEY_WIDTH / 2;
const styles = StyleSheet.create({
    container: {
        borderTopWidth: 2,
        borderTopColor: Colors.custom_keyboard_top_border_color
    },
    key: {
        width: KEY_WIDTH,
        height: KEY_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.custom_keyboard_border_color,
        backgroundColor: '#ffffff',
    },
    centerKey: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.custom_keyboard_border_color,
        borderLeftWidth: 1,
        borderLeftColor: Colors.custom_keyboard_border_color,
        borderRightWidth: 1,
        borderRightColor: Colors.custom_keyboard_border_color,
    },
    noneBorderBottom: {
        borderBottomWidth: 0,
    },
    number: {
        color: 'black',
        // fontSize: 22,
        textAlign: 'center',
        fontWeight: '400'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    longPress: {
        backgroundColor: Colors.custom_keyboard_border_color
    },
    backspace: {
        width: 20,
        height: 20,
        tintColor: 'white',
        overflow: 'hidden',
    },
    emptyKey: {
        backgroundColor: Colors.custom_keyboard_empty_key
    }
});

export default class NumberKeyboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            longPressNumber: null
        };
    }

    onPress = (number) => {
        const { onPress } = this.props;
        if (onPress && typeof onPress === 'function') onPress(number);
    }

    onBackSpace = () => {
        const { onBackSpace } = this.props;
        if (onBackSpace && typeof onBackSpace === 'function') onBackSpace();
    }

    renderKey = (number, style) => {
        const { longPressNumber } = this.state;
        return (
            <TouchableOpacity
                onPress={() => this.onPress(number)}
                onPressOut={() => {
                    this.setState({ longPressNumber: null });
                }}
                onPressIn={() => {
                    this.setState({ longPressNumber: number });
                }}
            >
                <View style={[longPressNumber === number ? styles.longPress : {}, style]}>
                    <Text.H3 style={styles.number}>{number}</Text.H3>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    {this.renderKey(1, [styles.key])}
                    {this.renderKey(2, [styles.key, styles.centerKey])}
                    {this.renderKey(3, [styles.key])}
                </View>
                <View style={styles.row}>
                    {this.renderKey(4, [styles.key])}
                    {this.renderKey(5, [styles.key, styles.centerKey])}
                    {this.renderKey(6, [styles.key])}
                </View>
                <View style={styles.row}>
                    {this.renderKey(7, [styles.key])}
                    {this.renderKey(8, [styles.key, styles.centerKey])}
                    {this.renderKey(9, [styles.key])}
                </View>
                <View style={styles.row}>
                    <View style={[styles.key, styles.emptyKey]} />
                    {this.renderKey(0, [styles.key, styles.noneBorderBottom])}
                    <TouchableOpacity onPress={this.onBackSpace} activeOpacity={0.7}>
                        <View style={[styles.key, styles.emptyKey]}>
                            <Image source={Icons.ic_backspace_24} style={styles.backspace} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
