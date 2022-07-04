/* eslint-disable react/no-unused-state */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    StyleSheet, Dimensions, View, Animated, Keyboard, Platform,
} from 'react-native';
import {
    Text, Image, ScreenUtils, IconSource
} from '@momo-kits/core';
import Lottie from '@momo-kits/lottie';
import DraggableComponent from './DraggableComponent';

const { ifIphoneX } = ScreenUtils;

const { width: widthScreen, height: heightScreen } = Dimensions.get('window');
const IMAGE_ASSISTANT = IconSource.ic_assistant;
const IMAGE_ASSISTANT_WIDTH = 72;
const IMAGE_ASSISTANT_HEIGHT = (IMAGE_ASSISTANT_WIDTH * 214) / 187;
const IMAGE_ASSISTANT_ARROW = IconSource.ic_arrow_assistant;
const IMAGE_ASSISTANT_ARROW_SIZE = 12;
const MESSAGE_BACKGROUND_COLOR = '#096dd9';
const MARGIN_PARENT = 16;
const MESSAGE_DURATION = 1000;
const AUTO_HIDE_MESSAGE_TIMEOUT = 10000;
const TOGGLE_ASSISTANT_DURATION = 200;

const styles = StyleSheet.create({
    container: { minHeight: IMAGE_ASSISTANT_HEIGHT },
    imageAssistantContainer: { position: 'absolute', right: 0, top: 0 },
    imageAssistant: { width: IMAGE_ASSISTANT_WIDTH, height: IMAGE_ASSISTANT_HEIGHT },
    messageOverlay: {
        width: widthScreen - MARGIN_PARENT * 2 - IMAGE_ASSISTANT_WIDTH,
        justifyContent: 'center',
        top: IMAGE_ASSISTANT_HEIGHT * 0.2,
        overflow: 'hidden',
        // backgroundColor: 'red',
    },
    messageOverlayLeft: {
        left: IMAGE_ASSISTANT_WIDTH,
        paddingStart: IMAGE_ASSISTANT_ARROW_SIZE,
    },
    messageOverlayRight: {
        right: widthScreen - MARGIN_PARENT * 2 - IMAGE_ASSISTANT_WIDTH,
        paddingEnd: IMAGE_ASSISTANT_ARROW_SIZE,
    },
    messageContainer: {
        maxWidth: '100%',
        padding: 12,
        backgroundColor: MESSAGE_BACKGROUND_COLOR,
        borderRadius: 8,
        minHeight: 50,
        justifyContent: 'center',
    },
    iconArrow: {
        position: 'absolute',
        top: 8,
        width: IMAGE_ASSISTANT_ARROW_SIZE,
        height: (IMAGE_ASSISTANT_ARROW_SIZE * 30) / 16,
        resizeMode: 'stretch',
        tintColor: MESSAGE_BACKGROUND_COLOR,
    },
    iconArrowLeft: { left: -IMAGE_ASSISTANT_ARROW_SIZE, transform: [{ rotate: '180deg' }] },
    iconArrowRight: { right: -IMAGE_ASSISTANT_ARROW_SIZE },
    messageText: { color: 'white' },
    closeIcon: {
        width: 24,
        height: 24,
        backgroundColor: 'white',
        borderRadius: 12
    },
    btnClose: {
        position: 'absolute',
        top: -20,
        right: -12,
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        width: 35
    }
});

const getPosition = (isLeft) => ({
    x: isLeft ? 0 : widthScreen,
    y: heightScreen,
});

const BOTTOM_SPACE = 100;
const getBottomPosition = () => heightScreen - ifIphoneX(30, 20) - 54 - ifIphoneX(34, 0) - BOTTOM_SPACE;

export default class DraggableButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageAssistant: props.icon || IMAGE_ASSISTANT,
            keyBoardPosition: props.keyBoardPosition || 0,
            isLeft: props.isLeft || false,
            isShow: props.isShow || false,
            defaultPosition: props.defaultPosition || undefined,
            message: props.message || ''
        };
        this.animatedMessage = new Animated.Value(0);
        this.animatedShowAssistant = new Animated.Value(0);
        this.animatedNotify = new Animated.ValueXY();
    }

    componentDidMount() {
        const keyboardShow = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
        const keyboardHide = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

        this.keyBoardListenerShow = Keyboard.addListener(keyboardShow, (e) => {
            const { screenY = 0 } = e?.endCoordinates || {};
            const newY = screenY - IMAGE_ASSISTANT_HEIGHT - BOTTOM_SPACE;
            this.setState({ keyBoardPosition: newY }, () => {
                const { defaultPosition, isLeft } = this.state;
                const { y: currentY } = defaultPosition || getPosition(isLeft);
                if (currentY > newY) {
                    this.hadUpdatePositionByKeyboard = true;
                    this.draggableRef?.gotoPosition?.({ y: newY }, true);
                }
            });
        });

        this.keyBoardListenerHide = Keyboard.addListener(keyboardHide, (e) => {
            this.setState({ keyBoardPosition: 0 }, () => {
                if (this.hadUpdatePositionByKeyboard) {
                    this.hadUpdatePositionByKeyboard = false;
                    this.draggableRef?.gotoPosition?.({ y: heightScreen }, true);
                }
            });
        });
    }

    componentWillUnmount() {
        this.keyBoardListenerShow?.remove?.();
        this.keyBoardListenerHide?.remove?.();
    }

    updateInactiveArgs = (args) => {
        this.draggableRef?.updateInactiveArgs?.(args);
    };

    show = (delay = 0, defaultPosition = null) => {
        setTimeout(
            () => {
                if (this.timeoutHide) {
                    clearTimeout(this.timeoutHide);
                }
                this.setState((preState) => ({
                    isShow: true,
                    defaultPosition: defaultPosition || preState.defaultPosition,
                }),
                () => {
                        this.draggableRef?.userTouch?.();
                        this.toggle(true, () => {
                            if (!this.showingMessage) {
                                this.draggableRef?.userUntouch?.();
                            }
                        });
                }
                );
            },
            delay > 0 ? delay : 0
        );
    };

    hide = () => {
        const { requestClose } = this.props;
        this.toggle(false);
        this.timeoutHide = setTimeout(() => {
            this.setState({ isShow: false }, () => requestClose?.());
        }, TOGGLE_ASSISTANT_DURATION);
    };

    toggle = (show, callback) => {
        Animated.timing(this.animatedShowAssistant, {
            toValue: show ? 1 : 0,
            duration: TOGGLE_ASSISTANT_DURATION,
            useNativeDriver: true,
        }).start(callback);
    };

    updateMessage = (
        message,
        autoHideTimeout = AUTO_HIDE_MESSAGE_TIMEOUT,
        duration = MESSAGE_DURATION
    ) => {
        if (message && message.length > 0) {
            this.showMessage(message, autoHideTimeout, duration);
        } else {
            this.hideMessage(duration);
        }
    };

    showMessage = (message, autoHideTimeout, duration) => {
        if (this.timeoutHideMessage) {
            clearTimeout(this.timeoutHideMessage);
            this.timeoutHideMessage = 0;
        }
        this.showingMessage = true;
        this.setState({ message }, () => {
            this.draggableRef?.userTouch?.();
            this.toggleMessage(true, duration, () => {
                if (autoHideTimeout > 0) {
                    this.timeoutHideMessage = setTimeout(() => {
                        this.hideMessage(duration);
                    }, autoHideTimeout);
                }
            });
        });
    };

    hideMessage = (duration) => {
        this.showingMessage = false;
        this.toggleMessage(false, duration, () => {
            this.draggableRef?.userUntouch?.();
            this.setState({ message: null });
        });
    };

    toggleMessage = (show, duration, callback) => {
        const refactorDuration = duration > 0 ? duration : 0;
        Animated.timing(this.animatedMessage, {
            toValue: show ? 1 : 0,
            duration: refactorDuration,
            useNativeDriver: true,
        }).start(callback);
    };

    setOnPressAction = (onPress) => {
        this.onPressAction = onPress;
    };

    updateActionSheetArgs = (args = {}) => {
        this.actionSheetArgs = args;
    };

    updateImage = (source) => {
        if (
            source
            && (typeof source === 'number'
                || typeof source === 'string'
                || typeof source.uri === 'string')
        ) {
            this.setState({ imageAssistant: source });
        } else {
            this.setState({ imageAssistant: IMAGE_ASSISTANT });
        }
    };

    handleItemSelected = (item, index) => {
        console.log('handleItemSelected');
    };

    showActionSheet = () => {
        const { onShowActionSheet, onCloseActionSheet } = this.actionSheetArgs || {};
        typeof onShowActionSheet === 'function' && onShowActionSheet();
        this.hide();
    };

    onPress = () => {
        const { message } = this.state || {};
        if (message && message.length > 0) {
            this.updateMessage(null);
        }
        if (typeof this.onPressAction === 'function') {
            this.onPressAction();
        }
    };

    render() {
        const {
            message,
            isShow,
            isLeft = false,
            defaultPosition: defaultPositionState,
            imageAssistant,
            keyBoardPosition
        } = this.state || {};

        const {
            dimensionClose, boundInside = undefined, style, blurInActive, isCloseIcon, isHasBottomBar, isLottie, lottieProps, imgStyle
        } = this?.props || {};
        if (!isShow) {
            return null;
        }
        const defaultPosition = defaultPositionState || getPosition(isLeft);
        const transformStyle = {
            transform: [
                {
                    translateX: this.animatedMessage.interpolate({
                        inputRange: [0, 1],
                        outputRange: isLeft ? [-widthScreen, 0] : [widthScreen, 0],
                    }),
                },
            ],
        };

        const showStyle = {
            transform: [{ scale: this.animatedShowAssistant }],
        };

        const positionBoundInside = boundInside || {
            top: MARGIN_PARENT, left: MARGIN_PARENT, right: MARGIN_PARENT, bottom: keyBoardPosition && keyBoardPosition > 0 ? keyBoardPosition : getBottomPosition(),
        };

        const defaultClosePosition = keyBoardPosition && keyBoardPosition > 0 ? keyBoardPosition : getBottomPosition();

        return (
            <DraggableComponent
                ref={(ref) => (this.draggableRef = ref)}
                style={[styles.container, style]}
                blurInActive={blurInActive}
                width={IMAGE_ASSISTANT_WIDTH}
                height={IMAGE_ASSISTANT_HEIGHT}
                onPress={this.onPress}
                isCloseIcon={isCloseIcon}
                isHasBottomBar={isHasBottomBar}
                onClose={this.hide}
                showStyle={showStyle}
                defaultPosition={defaultPosition}
                onSwpipeStart={() => this.draggableRef?.userTouch?.()}
                onSwpipeMove={(position, left) => {
                    if (left !== isLeft) {
                        this.setState({
                            isLeft: left,
                        });
                    }
                    // this.updateMessage(null);
                }}
                onSwpipeRelease={(position, left) => {
                    if (!this.showingMessage) {
                        this.draggableRef?.userUntouch?.();
                    }
                    this.setState({
                        isLeft: left,
                        defaultPosition: position,
                    });
                }}
                onRefactorDefaultPosition={(position, left) => {
                    this.setState({
                        isLeft: left,
                        defaultPosition: position,
                    });
                }}
                boundInside={positionBoundInside}
                defaultClosePosition={defaultClosePosition}
                dimensionClose={dimensionClose}
            >
                <Animated.View pointerEvents="box-none" style={showStyle}>

                    <View style={styles.imageAssistantContainer}>
                        {
                            isLottie
                                ? (
                                    <Lottie
                                        {...lottieProps}
                                        style={[styles.imageAssistant, imgStyle]}
                                        source={imageAssistant}
                                    />
                                ) : (
                                    <Image resizeMode="contain" style={[styles.imageAssistant, imgStyle]} source={imageAssistant} />

                                )
                        }
                    </View>

                    {message && message.length > 0 ? (
                        <View
                            pointerEvents="box-none"
                            style={[
                                styles.messageOverlay,
                                isLeft ? styles.messageOverlayLeft : styles.messageOverlayRight
                            ]}
                        >
                            <Animated.View
                                pointerEvents="box-none"
                                ref={(ref) => (this.messageContainerRef = ref)}
                                style={[{ backgroundColor: 'green' }, styles.messageContainer, transformStyle]}
                                onPress={this.onPress}
                            >
                                <Image
                                    style={[
                                        styles.iconArrow,
                                        isLeft ? styles.iconArrowLeft : styles.iconArrowRight,
                                    ]}
                                    source={IMAGE_ASSISTANT_ARROW}
                                />
                                <Text style={styles.messageText}>{message}</Text>
                            </Animated.View>
                        </View>
                    ) : null}
                </Animated.View>
            </DraggableComponent>

        );
    }
}

DraggableButton.propTypes = {
    defaultPosition: PropTypes.object,
    boundInside: PropTypes.object,
    icon: PropTypes.any,
    blurInActive: PropTypes.bool,
    style: PropTypes.any,
    isLeft: PropTypes.bool,
    isShow: PropTypes.bool,
    message: PropTypes.string,
    keyBoardPosition: PropTypes.number,
    isCloseIcon: PropTypes.bool,
    requestClose: PropTypes.func,
    isHasBottomBar: PropTypes.bool,
    lottieProps: PropTypes.object,
    isLottie: PropTypes.bool
};

DraggableButton.defaultProps = {
    blurInActive: true
};
