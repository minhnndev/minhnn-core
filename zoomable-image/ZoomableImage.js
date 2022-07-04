import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    Dimensions, View, StyleSheet, Image as NativeImage
} from 'react-native';
import {
    IconSource, ValueUtil, ScreenUtils, Image, RNGestureHandler, ImageZoom
} from '@momo-kits/core';

const { TouchableOpacity } = RNGestureHandler;

const { ifIphoneX } = ScreenUtils;

const MAX_WIDTH = Dimensions.get('window').width;
const MAX_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',

    },
    image: {
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        resizeMode: 'contain'
    },
    closeContainer: {
        position: 'absolute',
        top: ifIphoneX(58, 34),
        right: 12
    },
    iconClose: {
        width: 24,
        height: 24,
        tintColor: 'white'
    }
});

class ZoomableImage extends Component {
    onClose = () => {
        const { requestClose } = this.props;
        if (requestClose && typeof requestClose === 'function') {
            requestClose(this.iconClose);
        } else {
            this.iconClose();
        }
    }

    iconClose = () => {
        const { onClose } = this.props;
        if (onClose && typeof onClose === 'function') onClose();
    }

    render() {
        const {
            source, imageWidth, imageHeight, resizeMode, useNativeImage, overlayStyle
        } = this.props;
        const customImageStyle = {
            width: imageWidth,
            height: imageHeight
        };

        const imageSource = ValueUtil.getImageSource(source);
        const ImageComponent = useNativeImage ? NativeImage : Image;
        return (
            <View style={styles.container}>
                <ImageZoom
                    cropWidth={MAX_WIDTH}
                    cropHeight={MAX_HEIGHT}
                    imageWidth={MAX_WIDTH}
                    imageHeight={MAX_HEIGHT}
                    style={overlayStyle}
                >
                    <ImageComponent
                        resizeMode={resizeMode}
                        style={[styles.image, customImageStyle]}
                        source={imageSource}
                    />
                </ImageZoom>
                <View style={styles.closeContainer}>
                    <TouchableOpacity onPress={this.onClose}>
                        <Image
                            style={styles.iconClose}
                            source={IconSource.ic_close_x_24}
                        />
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

ZoomableImage.propTypes = {
    imageHeight: PropTypes.number,
    imageWidth: PropTypes.number,
    overlayStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    source: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({ uri: PropTypes.string })]),
    resizeMode: PropTypes.string,
    useNativeImage: PropTypes.bool
};

ZoomableImage.defaultProps = {
    resizeMode: 'contain',
    imageHeight: Dimensions.get('window').height,
    imageWidth: Dimensions.get('window').width,
    useNativeImage: false
};
export default ZoomableImage;
