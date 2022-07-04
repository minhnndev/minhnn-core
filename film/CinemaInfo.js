import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import {
    Colors, Text, IconSource
} from '@momo-kits/core';
import Shortcut from '@momo-kits/shortcut';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        // fontSize: 15,
        color: 'black',
        fontWeight: 'bold'
    },
    body: {
        // fontSize: 13,
        color: Colors.bluey_grey
    },
    bodyMargin: {
        marginTop: 3
    },
    info: {
        flex: 1,
        marginRight: 10
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconMargin: {
        marginLeft: 18
    },
    iconBlack: {
        tintColor: Colors.bluey_grey
    },
    flex: {
        flex: 1
    }

});

export default class CinemaInfo extends Component {
    onPress = () => {
        const { onPress } = this.props;
        if (onPress && typeof onPress === 'function') onPress();
    }

    render() {
        const {
            style, title, body, distance, tag, onLocationPress, onPricePress
        } = this.props;
        return (
            <View style={[styles.container, style]}>
                <TouchableOpacity onPress={this.onPress} activeOpacity={0.5} style={styles.flex}>
                    <View style={styles.info}>
                        <Text.Title style={styles.title}>{title}</Text.Title>
                        <Text.SubTitle numberOfLines={2} style={[styles.body, styles.bodyMargin]}>
                            {body}
                        </Text.SubTitle>
                    </View>
                </TouchableOpacity>
                <View style={styles.iconRow}>
                    <Shortcut
                        title={tag}
                        source={IconSource.ic_film_ticket}
                        titleStyle={styles.body}
                        iconStyle={styles.iconBlack}
                        onPress={onPricePress}
                    />
                    <Shortcut
                        style={styles.iconMargin}
                        title={distance}
                        source={IconSource.ic_film_pin}
                        titleStyle={styles.body}
                        iconStyle={styles.iconBlack}
                        onPress={onLocationPress}
                    />
                </View>
            </View>
        );
    }
}

CinemaInfo.propTypes = {
    body: PropTypes.string,
    distance: PropTypes.string,
    title: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    tag: PropTypes.string
};
