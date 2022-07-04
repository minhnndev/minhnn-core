import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, Dimensions
} from 'react-native';
import {
    Colors, ValueUtil, Text, Image, IconSource, ScaleSize
} from '@momo-kits/core';
import { SelectionItem } from '@momo-kits/selection';
import Shortcut from '@momo-kits/shortcut';

const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    containerStyle: {
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden'
    },
    discountImage: {
        width: 40,
        height: 40,
        position: 'absolute',
        right: 0,
        top: 0
    },
    shape: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderRightWidth: 20,
        borderTopWidth: 20,
        borderRightColor: 'transparent',
        borderTopColor: Colors.primary
    },
    overlay: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    icCheck: {
        width: 12, height: 12, position: 'absolute', tintColor: 'white'
    },
    typeListIconStyle: {
        width: 42,
        height: 42,
        padding: 6,
        borderRadius: 4
    },
    typeListItem: {
        marginHorizontal: 10,
        marginTop: 0,
        borderRadius: 8
    },
    typeListTitle: { fontWeight: 'bold' },
    typeListLocationIcon: {
        tintColor: Colors.link,
        width: 16,
        height: 16
    },
    typeListDistance: { color: Colors.black_12 },
    typeListDropDownIcon: {
        tintColor: Colors.black_17,
        width: 24,
        height: 24,
        alignSelf: 'flex-end'
    },
    leftIconContainer: {
        borderWidth: 1,
        borderColor: Colors.borders,
        borderRadius: 4
    },
    row: { flexDirection: 'row' },
    titleSelectedStyle: {
        fontWeight: 'bold'
    },
    title: {
        color: Colors.black_17
    },
    body: {
        fontSize: ScaleSize(12)
    },
    between: { justifyContent: 'space-between' }
});

export default class CinemaBrand extends Component {
    onPress = () => {
        const { onPress } = this.props;
        if (onPress && typeof onPress === 'function') onPress();
    }

    cinemaBrandTypeList = (source, title, body, distance, style, icon = IconSource.ic_arrow_drop_down_24, distanceStyle, titleStyle = {}, bodyStyle = {}, rightIconStyle = {}) => (
        <SelectionItem
            onPress={this.onPress}
            leftIconStyle={styles.typeListIconStyle}
            style={[styles.typeListItem, style]}
            leftIconContainerStyle={styles.leftIconContainer}
            title={title}
            titleStyle={[styles.typeListTitle, titleStyle]}
            body={body}
            bodyStyle={[styles.body, bodyStyle]}
            leftIcon={source}
            rightIcon={null}
            rightComponent={(
                <View style={styles.between}>
                    <Image
                        style={[styles.typeListDropDownIcon, ValueUtil.extractStyle(rightIconStyle)]}
                        source={icon}
                    />
                    <Text.Title style={[styles.typeListDistance, ValueUtil.extractStyle(distanceStyle)]}>{distance}</Text.Title>
                </View>
            )}
        />
    )

    cinemaBrandTypeIcon = (source, title, selected, style, discountImageSource, iconStyle = {}, titleStyle, customSize = {}, numColumns) => {
        const itemWidth = (WIDTH - (numColumns - 1) * 16 - 32) / numColumns;
        let customSizeStyle = customSize;
        if (Object.keys(customSizeStyle).length === 0) {
            customSizeStyle = { width: itemWidth, height: itemWidth };
        }
        return (
            <Shortcut
                style={[ValueUtil.extractStyle(style), { width: itemWidth, height: itemWidth + (title ? 25 : 0) }]}
                onPress={this.onPress}
                customSize={customSizeStyle}
                source={source}
                title={title}
                titleStyle={[styles.title, { fontWeight: selected ? 'bold' : '400' }, titleStyle]}
                iconContainerStyle={[styles.containerStyle, { borderColor: selected ? Colors.primary : Colors.borders }]}
                iconStyle={[{ borderRadius: 4 }, ValueUtil.extractStyle(iconStyle)]}
                overlayComponent={(
                    <View style={styles.overlay}>
                        <Image
                            style={styles.discountImage}
                            source={discountImageSource}
                        />
                    </View>
                )}
            />
        );
    }

    render() {
        const {
            selected, style, source, discountImage, title, type, body, distance, iconStyle,
            titleStyle, expendIcon, customSize, numColumns, distanceStyle, bodyStyle, rightIconStyle
        } = this.props;
        const discountImageSource = ValueUtil.getImageSource(discountImage);
        const imageSource = ValueUtil.getImageSource(source);
        if (type === 'listItem') {
            return this.cinemaBrandTypeList(imageSource, title, body, distance, style, expendIcon, distanceStyle, titleStyle, bodyStyle, rightIconStyle);
        }
        return this.cinemaBrandTypeIcon(imageSource, title, selected, style, discountImageSource, iconStyle, titleStyle, customSize, numColumns);
    }
}

CinemaBrand.propTypes = {
    body: PropTypes.string,
    discountImage: PropTypes.oneOfType([PropTypes.shape({
        uri: PropTypes.string
    }), PropTypes.string, PropTypes.number]),
    distance: PropTypes.string,
    onPress: PropTypes.func,
    selected: PropTypes.bool,
    source: PropTypes.oneOfType([PropTypes.shape({
        uri: PropTypes.string
    }), PropTypes.string, PropTypes.number]),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    iconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    titleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    bodyStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    title: PropTypes.string,
    type: PropTypes.oneOf(['listItem', 'default']),
    numColumns: PropTypes.number,
    distanceStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

CinemaBrand.defaultProps = {
    type: 'default',
    numColumns: 5
};
