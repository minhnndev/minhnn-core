/* eslint-disable indent */
import {
    View, StyleSheet, TouchableOpacity, Dimensions, Image
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Colors from '../../core/colors';
import ValueUtils from '../../core/utils/ValueUtil';
import Text from '../../core/components/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WIDTH = SCREEN_WIDTH - 20;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    icon: {
        width: 24,
        height: 24
    },
    title: {
        marginTop: 6,
        color: '#222222',
        textAlign: 'center',
        flexShrink: 0
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export const IconTextSize = {
    tiny: 'tiny',
    small: 'small',
    medium: 'medium',
    large: 'large',
    giant: 'giant'
};

export const iconSizes = StyleSheet.create({
    tiny: {
        width: 20,
        height: 20,
        borderRadius: 8
    },
    small: {
        width: WIDTH / 12,
        height: WIDTH / 12,
        borderRadius: WIDTH / 24
    },
    medium: {
        width: WIDTH / 8,
        height: WIDTH / 8,
        borderRadius: WIDTH / 14
    },
    large: {
        width: WIDTH / 5,
        height: WIDTH / 5,
        borderRadius: WIDTH / 10
    },
    giant: {
        width: WIDTH / 3.5,
        height: WIDTH / 3.5,
        borderRadius: WIDTH / 7
    }
});

const textStyles = StyleSheet.create({
    tiny: {
        fontSize: 11
    },
    small: {
        fontSize: 12
    },
    medium: {
        fontSize: 14
    },
    large: {
        fontSize: 16
    },
    giant: {
        fontSize: 18
    }
});

export default class IconText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadResourceFail: false
        };
    }

    mapStyleFromSize = (size) => {
        let iconStyle = {};
        const { customSize } = this.props;
        if (customSize) return customSize;
        switch (size) {
            case IconTextSize.tiny: {
                iconStyle = iconSizes.tiny;
                break;
            }
            case IconTextSize.small: {
                iconStyle = iconSizes.small;
                break;
            }
            case IconTextSize.medium: {
                iconStyle = iconSizes.medium;
                break;
            }
            case IconTextSize.large: {
                iconStyle = iconSizes.large;
                break;
            }
            case IconTextSize.giant: {
                iconStyle = iconSizes.giant;
                break;
            }
            default:
                iconStyle = iconSizes.tiny;
        }
        return iconStyle;
    }

    mapTextStyle = (size) => {
        let iconStyle = {};
        switch (size) {
            case IconTextSize.tiny: {
                iconStyle = textStyles.tiny;
                break;
            }
            case IconTextSize.small: {
                iconStyle = textStyles.small;
                break;
            }
            case IconTextSize.medium: {
                iconStyle = textStyles.medium;
                break;
            }
            case IconTextSize.large: {
                iconStyle = textStyles.large;
                break;
            }
            case IconTextSize.giant: {
                iconStyle = textStyles.giant;
                break;
            }
            default:
                iconStyle = textStyles.tiny;
        }
        return iconStyle;
    }

    extractSize = (iconSize) => {
        const {
            radius, iconContainerStyle, iconStyle
        } = this.props;
        const iconPadding = get(iconStyle, 'padding', 4);
        const borderWidth = get(iconContainerStyle, 'borderWidth', 0);
        const borderColor = get(iconContainerStyle, 'borderColor', Colors.hint);
        const containerWidth = Math.round(iconSize.width + iconPadding + borderWidth);
        const extractStyle = {
            width: containerWidth,
            height: containerWidth,
            borderRadius: containerWidth / 2,
            borderColor,
            borderWidth
        };
        if (!radius) delete extractStyle.borderRadius;
        return extractStyle;
    }

    onPress = () => {
        const { onPress } = this.props;
        if (onPress && typeof onPress === 'function') onPress();
    }

    onError = () => {
        this.setState({ loadResourceFail: true });
    }

    render() {
        const {
            title, source, style, titleStyle, iconStyle, size, iconContainerStyle, onPress, defaultIcon, overlayComponent
        } = this.props;
        const iconSource = ValueUtils.getImageSource(source);
        const defaultIconSource = ValueUtils.getImageSource(defaultIcon);
        const iconSize = this.mapStyleFromSize(size);
        const mapTextStyle = this.mapTextStyle(size);
        const iconContainerSize = this.extractSize(iconSize);
        const { loadResourceFail } = this.state;
        let displayIcon = null;
        if (defaultIcon && loadResourceFail) {
            displayIcon = defaultIconSource;
        } else if (iconSource) {
            displayIcon = iconSource;
        }
        return (
            <TouchableOpacity onPress={this.onPress} activeOpacity={onPress ? 0.5 : 1}>
                <View style={[styles.container, style]}>
                    <View style={[styles.iconContainer, iconContainerSize, iconContainerStyle]}>
                        {displayIcon ? (
                            <Image
                                style={[styles.icon, iconSize, iconStyle]}
                                resizeMode="contain"
                                source={displayIcon}
                                onError={this.onError}
                            />
                        ) : <View />}
                        {overlayComponent}
                    </View>
                    <Text.Title style={[styles.title, mapTextStyle, ValueUtils.extractStyle(titleStyle)]} numberOfLines={3} ellipsizeMode="tail">
                        {title?.trim?.()}
                    </Text.Title>
                </View>
            </TouchableOpacity>

        );
    }
}

IconText.propTypes = {
    iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    source: PropTypes.oneOfType([PropTypes.shape({
        uri: PropTypes.string
    }), PropTypes.number, PropTypes.string]),
    defaultIcon: PropTypes.oneOfType([PropTypes.shape({
        uri: PropTypes.object
    }), PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
    size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'giant']),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    iconContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    overlayComponent: PropTypes.element
};
