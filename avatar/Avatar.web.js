/* eslint-disable indent */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Image, Dimensions
} from 'react-native';
import { get, isEqual } from 'lodash';
import ValueUtil from '../../core/utils/ValueUtil';
import Colors from '../../core/colors';
import { Icons as IconSource } from '../../core/icons';
import Text from '../../core/components/typography';
import { RFValueHorizontal as ScaleSize } from '../../core/components/typography/reponsiveSize';

export const AvatarQuality = {
    low: 'low',
    medium: 'medium',
    high: 'high',
};

const COLORS = [
    '#3683f3',
    '#ea63af',
    '#f94889',
    '#82b6da',
    '#2fc093',
    '#7b4a41',
    '#ff97bc',
    '#4130d7',
    '#c3c3c3',
    '#f7ae2f',
    '#b04595',
    '#57b748',
    '#ff8900',
    '#7841bf',
    '#be3f3e',
    '#c51515',
    '#8e6472',
    '#fed27d',
    '#ff6f5d',
    '#05b8ae',
];

export const AvatarSize = {
    tiny: 'tiny',
    small: 'small',
    medium: 'medium',
    large: 'large',
    giant: 'giant',
    size8: 'size8',
    size24: 'size24',
    size36: 'size36',
    size44: 'size44',
    size48: 'size48',
    size52: 'size52',
    size56: 'size56',
    size64: 'size64',
    size72: 'size72',
    size80: 'size80',
    size88: 'size88',
    size96: 'size96'
};

export const SubIconType = {
    momo: 'momo',
    online: 'online',
    key: 'key',
    none: 'none'
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    shortNameView: {
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: Colors.very_light_pink_four,
        width: '100%',
        height: '100%'
    },
    shortNameText: {
        // fontSize: 17,
        color: '#f6f6f6'
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    subIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    subIconImage: {
        width: 22,
        height: 22
    },
    subIconImageOnline: {
        backgroundColor: Colors.kiwi_green,
        borderColor: 'white',
        borderWidth: 1
    }
});

const subIconSize = (width) => ({
    tiny: {
        width: 8,
        height: 8,
        borderRadius: 4
    },
    small: {
        width: 10,
        height: 10,
        borderRadius: 5
    },
    medium: {
        width: 12,
        height: 12,
        borderRadius: 6
    },
    large: {
        width: 16,
        height: 16,
        borderRadius: 8
    },
    size8: {
        width: 8,
        height: 8,
        borderRadius: 4
    },
    size24: {
        width: 10,
        height: 10,
        borderRadius: 5
    },
    size36: {
        width: 10,
        height: 10,
        borderRadius: 5
    },
    size44: {
        width: 14,
        height: 14,
        borderRadius: 7
    },
    size48: {
        width: 14,
        height: 14,
        borderRadius: 7
    },
    size52: {
        width: 16,
        height: 16,
        borderRadius: 8
    },
    size56: {
        width: 16,
        height: 16,
        borderRadius: 8
    },
    size64: {
        width: 16,
        height: 16,
        borderRadius: 8,
        top: -2,
        left: -2,
    },
    size72: {
        width: 18,
        height: 18,
        borderRadius: 9,
        top: -3,
        left: -3,
    },
    size80: {
        width: 18,
        height: 18,
        borderRadius: 9,
        top: -3,
        left: -3,
    },
    size88: {
        width: 18,
        height: 18,
        borderRadius: 9,
        top: -4,
        left: -4,
    },
    size96: {
        width: 20,
        height: 20,
        borderRadius: 10,
        top: -4,
        left: -4,
    },
    giant: {
        top: -5,
        left: -5,
        width: 24,
        height: 24,
        borderRadius: 12
    }
});

const avatarSize = (width) => ({
    tiny: {
        width: 16,
        height: 16,
        borderRadius: 8
    },
    small: {
        width: 32,
        height: 32,
        borderRadius: 16
    },
    medium: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    large: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    giant: {
        width: 120,
        height: 120,
        borderRadius: 60
    },
    size8: {
        width: 8,
        height: 8,
        borderRadius: 4
    },
    size24: {
        width: 24,
        height: 24,
        borderRadius: 12
    },
    size36: {
        width: 36,
        height: 36,
        borderRadius: 18
    },
    size44: {
        width: 44,
        height: 44,
        borderRadius: 22
    },
    size48: {
        width: 48,
        height: 48,
        borderRadius: 24
    },
    size52: {
        width: 52,
        height: 52,
        borderRadius: 26
    },
    size56: {
        width: 56,
        height: 56,
        borderRadius: 28
    },
    size64: {
        width: 64,
        height: 64,
        borderRadius: 32
    },
    size72: {
        width: 72,
        height: 72,
        borderRadius: 36
    },
    size80: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    size88: {
        width: 88,
        height: 88,
        borderRadius: 44
    },
    size96: {
        width: 96,
        height: 96,
        borderRadius: 48
    }
});

const shortName = (width) => ({
    tiny: {
        fontSize: ScaleSize(5, width)
    },
    small: {
        fontSize: ScaleSize(11, width)
    },
    medium: {
        fontSize: ScaleSize(15, width)
    },
    large: {
        fontSize: ScaleSize(20, width)
    },
    giant: {
        fontSize: ScaleSize(25, width)
    }
});

export default class Avatar extends Component {
    constructor(props) {
        super(props);
        this.color = this.getAvatarColor(props.name);
        this.state = {
            hideSource: false,
            ownUpdate: false,
            source: props.source,
            dimensions: {}
        };
    }

    componentDidMount() {
        const { scaleSize } = this.props;
        if (scaleSize) {
            this.subscription = Dimensions.addEventListener(
                'change',
                ({ window }) => {
                    if(window?.height > 0 && window?.width > 0) {
                        this.setState({ dimensions: window });
                    }
                }
            );
        }
    }

    componentWillUnmount() {
        const { scaleSize } = this.props;
        if (scaleSize) {
            this.subscription?.remove?.();
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.ownUpdate) {
            return {
                ownUpdate: false,
            };
        } if (!isEqual(nextProps.source, prevState.source)) {
            return { source: nextProps.source, hideSource: false };
        }
        return null;
    }

    getContactShortName = (name) => {
        if (!name) return '';
        const shortNameList = name.split(' ', 2);
        const alphabet = [];
        shortNameList.forEach((n) => {
            if (n && n.length > 0) {
                alphabet.push(n[0].toString().toUpperCase());
            }
        });
        return alphabet.join('');
    }

    renderShortName = (name, avatarStyle, size) => {
        if (name) {
            const shortedName = this.getContactShortName(name);
            const shortNameStyle = this.mapShortNameStyle(size);
            return (
                <View style={[styles.shortNameView, avatarStyle]}>
                    <Text.H4 style={[styles.shortNameText, shortNameStyle]}>{shortedName}</Text.H4>
                </View>
            );
        }
        return <View />;
    }

    isUrl(url) {
        const expression = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/gi;
        return expression.test(url);
    }

    isValidImageUrl = (source) => {
        const validSource = source && source.uri && this.isUrl(source.uri);
        return validSource;
    }

    mapAvatarQuality = (url, quality) => {
        if (!quality || quality === AvatarQuality.medium) {
            return url;
        }
        if (quality === AvatarQuality.low) {
            return url.replace('.png', '_s64.png');
        }
        if (quality === AvatarQuality.high) {
            return url.replace('.png', '_s512.png');
        }

        return url;
    }

    mapStyleFromSize = (size) => {
        const { dimensions } = this.state;
        const avatarStyle = avatarSize(dimensions?.width || null).small;
        if (typeof size === 'object') return size;
        if (avatarSize(dimensions?.width || null)[size]) return avatarSize(dimensions?.width || null)[size];
        return avatarStyle;
    }

    mapShortNameStyle = (size) => {
        let shortNameStyle = {};
        const { dimensions } = this.state;
        switch (size) {
            case AvatarSize.tiny: {
                shortNameStyle = shortName(dimensions?.width || null).tiny;
                break;
            }
            case AvatarSize.small: {
                shortNameStyle = shortName(dimensions?.width || null).small;
                break;
            }
            case AvatarSize.medium: {
                shortNameStyle = shortName(dimensions?.width || null).medium;
                break;
            }
            case AvatarSize.large: {
                shortNameStyle = shortName(dimensions?.width || null).large;
                break;
            }
            case AvatarSize.giant: {
                shortNameStyle = shortName(dimensions?.width || null).giant;
                break;
            }
            default:
                shortNameStyle = shortName(dimensions?.width || null).small;
        }
        return shortNameStyle;
    }

    mapSubIconSize = (size) => {
        const { dimensions } = this.state;
        const subIconStyle = subIconSize(dimensions?.width || null).small;
        if (subIconSize(dimensions?.width || null)[size]) return subIconSize(dimensions?.width || null)[size];
        return subIconStyle;
    }

    extractSize = (avatarStyle) => {
        const { style } = this.props;
        const borderWidth = get(style, 'borderWidth', 1);
        const containerWidth = Math.round(avatarStyle.width + 2 + borderWidth);
        return {
            width: containerWidth,
            height: containerWidth,
            borderRadius: containerWidth / 2,
            borderWidth,
            borderColor: Colors.black_01
        };
    }

    getAvatarColor(name) {
        const shortName = this.getContactShortName(name)
        if (!shortName) return "#d5d6d6"
        const firstLetter = shortName[0].charCodeAt(0)
        let colorIndex = Number(firstLetter) % 26
        if (colorIndex > 19) colorIndex = 25 - colorIndex
        return COLORS[colorIndex]
    }


    onLoadSourceError = () => {
        this.setState({ hideSource: true, ownUpdate: true });
    }

    renderSubIcon = () => {
        const { subIcon, size, subIconSource } = this.props;
        if ((!subIcon || subIcon === SubIconType.none) && !subIconSource) return <View />;
        const subIconSizeStyle = this.mapSubIconSize(size);
        const iconSource = ValueUtil.getImageSource(subIconSource);
        return (
            <View style={styles.subIcon}>
                {subIcon === SubIconType.momo
                    ? (
                        <Image
                            style={[styles.subIconImage, subIconSizeStyle]}
                            source={IconSource.ic_round_momo_tiny}
                        />
                    )
                    : <View />}
                {subIcon === SubIconType.online
                    ? <View style={[styles.subIconImageOnline, subIconSizeStyle]} /> : <View />}

                {iconSource && subIconSource && !subIcon ? (
                    <Image
                        style={[styles.subIconImage, subIconSizeStyle]}
                        source={iconSource}
                    />
                )
                    : <View />}
            </View>
        );
    }

    onPress = () => {
        const { onPress } = this.props;
        if (onPress && typeof onPress === 'function') onPress();
    }

    render() {
        const {
            size, source, name, resizeMode, style, onPress, isShowLoading, loading, cached, extraPropsImage, quality
        } = this.props;
        const { hideSource } = this.state;
        const avatarStyle = this.mapStyleFromSize(size);
        const containerSize = this.extractSize(avatarStyle);
        const imageSource = ValueUtil.getImageSource(source);
        const showName = typeof imageSource === 'object' && Object.keys(imageSource).length === 0 && typeof imageSource !== 'number';
        // add priority high for avatar
        if (imageSource?.uri) {
            imageSource.priority = 'high';
            imageSource.uri = this.mapAvatarQuality(imageSource.uri, quality);
            // if doest not have time query, set default cache time to 1 day
            if (!imageSource.uri?.includes('?') && cached) {
                const midnight = new Date().setHours(0, 0, 0, 0);
                imageSource.uri = `${imageSource.uri}?time=${midnight}`;
            }
        }

        const inner = (
            <View style={[styles.container, containerSize, style]}>
                {(showName || hideSource) ? this.renderShortName(name, avatarStyle, size) : <View />}
                {this.isValidImageUrl(imageSource) && !hideSource
                    ? (
                        <Image
                            cached={cached}
                            loading={loading || isShowLoading}
                            source={imageSource}
                            onError={this.onLoadSourceError}
                            style={avatarStyle}
                            resizeMode={resizeMode}
                            {...extraPropsImage}
                        />
                    ) : <View />}
                {this.renderSubIcon()}
            </View>
        );
        if (onPress) {
            return (
                <TouchableOpacity activeOpacity={onPress ? 0.5 : 1} onPress={this.onPress}>
                    {inner}
                </TouchableOpacity>
            );
        }
        return inner;
    }
}

Avatar.propTypes = {
    name: PropTypes.string,
    resizeMode: PropTypes.string,
    quality: PropTypes.oneOf(['low', 'medium', 'high']),
    size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'giant', 'size8', 'size24', 'size36', 'size44', 'size48', 'size52', 'size56', 'size64', 'size72', 'size80', 'size88', 'size96',
        PropTypes.shape({
            width: PropTypes.number, height: PropTypes.number, borderRadius: PropTypes.number
        })]),
    source: PropTypes.oneOfType([PropTypes.shape({ uri: PropTypes.string }), PropTypes.number, PropTypes.string]),
    subIcon: PropTypes.oneOf(['momo', 'online', 'key', 'none']),
    subIconSource: PropTypes.oneOfType([PropTypes.shape({ uri: PropTypes.string }), PropTypes.number, PropTypes.string]),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onPress: PropTypes.func,
    loading: PropTypes.bool,
    cached: PropTypes.bool,
    scaleSize: PropTypes.bool,
    extraPropsImage: PropTypes.object
};

Avatar.defaultProps = {
    resizeMode: 'cover',
    cached: true,
    scaleSize: false,
    quality: 'medium',
};
