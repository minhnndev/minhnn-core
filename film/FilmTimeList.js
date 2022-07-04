import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, FlatList, Dimensions, Image
} from 'react-native';
import {
    Colors, Button
   } from '@momo-kits/core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LEFT_WIDTH = (116 / 3) * 1.7;
const RIGHT_WIDTH = SCREEN_WIDTH - LEFT_WIDTH;
const PADDING_HORIZONTAL = 20;
const SPACE = 10;
const BUTTON_WIDTH = ((RIGHT_WIDTH - PADDING_HORIZONTAL - SPACE) / 4) - 5;
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    left: {
        width: LEFT_WIDTH,
        alignItems: 'center'
    },
    right: {
        flex: 1
    },
    list: {
        marginTop: SPACE
    },
    icon: {
        width: 116 / 3,
    },
    button: { width: BUTTON_WIDTH, height: 25, backgroundColor: Colors.film_time },
    buttonMarginRight: {
        marginRight: SPACE
    },
    buttonTextStyle: {
        fontSize: 13,
        fontWeight: 'normal'
    }
});

export default class FilmTimeList extends Component {
    onTimePress = (item, index) => {
        const { onTimePress } = this.props;
        if (onTimePress && typeof onTimePress === 'function') onTimePress(item, index);
    }

    renderItem = ({ item, index }) => {
        const marginRight = ((index + 1) % 4) === 1 || (index % 4 !== 0);
        return (
            <Button
                titleStyle={styles.buttonTextStyle}
                buttonStyle={[styles.button]}
                style={[marginRight ? styles.buttonMarginRight : {}]}
                title={item}
                onPress={() => this.onTimePress(item, index)}
            />
        );
    }

    render() {
        const { leftIcon, data, style } = this.props;
        return (
            <View style={[styles.container, style]}>
                <View style={styles.row}>
                    <View style={styles.left}>
                        <Image resizeMode="contain" style={styles.icon} source={leftIcon} />
                    </View>
                    <FlatList
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                        renderItem={this.renderItem}
                        style={styles.list}
                        numColumns={4}
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        );
    }
}

FilmTimeList.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            string: PropTypes.string
        })
    ),
    leftIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({ uri: PropTypes.string })]),
    onTimePress: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};
