import React, { Component } from 'react';
import {
    Animated,
    StyleSheet,
    PanResponder,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import lodash from 'lodash';
import {
    ScreenUtils, Image, Colors, IconSource
} from '@momo-kits/core';

const { ifIphoneX } = ScreenUtils;

const { width: widthScreen, height: heightScreen } = Dimensions.get('window');

let COMPONENT_WIDTH = 0;
let COMPONENT_HEIGHT = 0;
let INACTIVE_OPACITY = 0.5;
let OPACITY_DURATION = 200;
let OPACITY_TIMEOUT = 3000;
const GOTA_POSITION_DURATION = 300;

const styles = StyleSheet.create({
    container: { position: 'absolute' },
    btnClose: {
        position: 'absolute',
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        right: -20,
        top: -25,
    },
    closeIcon: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: 50,
        width: 50,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.border_color_gray
    },
    icon: {
        height: 25, width: 25
    }
});
export default class DraggableComponent extends Component {
    constructor(props) {
        super(props);
        const {
            defaultPosition, width, height, onRefactorDefaultPosition
        } = props;
        COMPONENT_WIDTH = width;
        COMPONENT_HEIGHT = height;
        const positionReactor = this.refactorPosition(defaultPosition);
        onRefactorDefaultPosition?.(positionReactor, this.checkIsLeft(positionReactor));
        this.state = {
            panAnimated: new Animated.ValueXY(positionReactor),
            opacityAnimated: new Animated.Value(INACTIVE_OPACITY),
            closeAnimted: new Animated.ValueXY(this.getClosePosition()),
            isShowClose: false
        };
        this.positionValue = positionReactor;
        this.close = false;
        this.setup();
    }

    getClosePosition = () => {
        const toX = widthScreen / 2 - 25;
        const toY = this.props.defaultClosePosition + (this.props.dimensionClose || 50);
        
        return { x: toX, y: toY };
    }

    refactorPosition = (defaultPosition) => {
        const { x, y } = defaultPosition || {};
        const {
            top: boundTop, left: boundLeft, right: boundRight, bottom: boundBottom
        } = this.props.boundInside || {};
        let toX = x;
        let toY = y;
        if (this.checkIsLeft(defaultPosition)) {
            toX = boundLeft;
        } else {
            toX = widthScreen - boundRight - COMPONENT_WIDTH;
        }
        if (y < boundTop) {
            toY = boundTop;
        } else if (y + COMPONENT_HEIGHT > boundBottom) {
            toY = boundBottom - COMPONENT_HEIGHT;
        }
        return { x: toX, y: toY, boundBottom };
    };

    checkIsLeft = (position) => {
        const { x } = position || {};
        return parseInt(x) + COMPONENT_WIDTH / 2 < widthScreen / 2;
    }

    /**
     * this.positionValue: { x: 0, y: 0 }: final position with screen
     * gesture: {"moveX":220,"moveY":516,"x0":105.75,"y0":675.25,"dx":8.5,"dy":61.5}: moveX:
     */
    setup = () => {
        const {
            onSwpipeStart, onSwpipeMove, onSwpipeRelease, onPress, isCloseIcon, width, height, isHasBottomBar
        } = this.props;

        const { panAnimated, close } = this.state || {};
        panAnimated.addListener((value) => (this.positionValue = value));
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) =>
                // this.enableParentScroll(false);
                true,
            onPanResponderGrant: (e, gesture) => {
                this.setState({ isShowClose: true });
                panAnimated.extractOffset();
                onSwpipeStart?.(this.positionValue, this.checkIsLeft(this.positionValue));
            },
            onPanResponderMove: Animated.event([null, { dx: panAnimated.x, dy: panAnimated.y }], {
                listener: (e, gesture) => {
                    onSwpipeMove?.(this.positionValue, this.checkIsLeft(this.positionValue));
                },
            }),
            onPanResponderTerminate: (e, gesture) => {
                // this.enableParentScroll(true);
            },
            onPanResponderRelease: (e, gesture) => {
                // this.enableParentScroll(true);
                const { x, y } = this.getClosePosition();
                const yCloseNormal = Math.round(gesture.moveY) >= Math.round(y + 50) && Math.round(gesture.moveY) <= Math.round(y + height * 1.5);
                const yCloseTabBar = Math.round(gesture.moveY) >= Math.round(y) && Math.round(gesture.moveY) <= Math.round(y + 62.5);
                const xClose = Math.round(gesture.moveX) >= Math.round(x + 12.5) && Math.round(gesture.moveX) <= Math.round(x + width);
                const yClose = isHasBottomBar ? yCloseTabBar : yCloseNormal;
                if (xClose && yClose) {
                    isCloseIcon && this.onClose();
                    return;
                }
                if (this.checkSingleClick(gesture, 5)) {
                    typeof onPress === 'function' && this.onPress('gesture');
                    this.setState({
                        isShowClose: false
                    });
                    return;
                }
                this.setState({
                    isShowClose: false
                });
                const toPosition = this.refactorPosition(this.positionValue);
                onSwpipeRelease?.(toPosition, this.checkIsLeft(toPosition));
                this.gotoPosition({ ...toPosition, type: 'spring', checkBoundInside: true });
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            //     // return true if user is swiping, return false if it's a single click
            //     true
            // ,
        });
    };

    checkSingleClick = (gestureState, value = 1) => Math.abs(gestureState.dx) < value && Math.abs(gestureState.dy) < value

    updateInactiveArgs = ({
        timeout = OPACITY_TIMEOUT,
        opacity = INACTIVE_OPACITY,
        duration = OPACITY_DURATION,
    } = {}) => {
        OPACITY_TIMEOUT = timeout;
        INACTIVE_OPACITY = opacity;
        OPACITY_DURATION = duration;
    };

    userTouch = () => {
        if (this.timeoutOpacity) {
            clearTimeout(this.timeoutOpacity);
            this.timeoutOpacity = 0;
        }
        Animated.timing(this.state.opacityAnimated, { toValue: 1, duration: 0 }).start();
    };

    userUntouch = ({
        timeout = OPACITY_TIMEOUT,
        opacity = INACTIVE_OPACITY,
        duration = OPACITY_DURATION,
    } = {}) => {
        const { opacityAnimated } = this.state;
        if (timeout > 0) {
            this.timeoutOpacity = setTimeout(() => {
                Animated.timing(opacityAnimated, {
                    toValue: opacity,
                    duration,
                }).start();
            }, timeout);
        }
    };

    gotoPosition = ({
        x = this.positionValue.x, y = this.positionValue.y, animated = true, type = 'timing'
    } = {}, checkBoundInside, callback) => {
        const { panAnimated } = this.state;
        panAnimated.flattenOffset();
        let position = { x, y };
        if (checkBoundInside) {
            position = this.refactorPosition(position);
        }
        if (type === 'spring') {
            Animated.spring(panAnimated, {
                toValue: position,
                duration: animated ? GOTA_POSITION_DURATION : 0,
            }).start(callback);
        } else {
            Animated.timing(panAnimated, {
                toValue: position,
                duration: animated ? GOTA_POSITION_DURATION : 0,
                friction: 5,
            }).start(callback);
        }
    };

    onPress = lodash.debounce(
        (type) => {
            const { onPress } = this.props;
            this.userTouch();
            this.userUntouch();
            onPress?.();
        },
        500,
        { leading: true, trailing: false }
    );

    onClose = () => {
        const { onClose } = this.props;
        onClose?.();
    }

    render() {
        const {
            style, children, onPress, blurInActive, showStyle, isCloseIcon
        } = this.props;
        const {
            panAnimated, opacityAnimated, closeAnimted, isShowClose
        } = this.state || {};
        const panStyle = {
            transform: panAnimated.getTranslateTransform(),
        };
        const closeStyle = {
            transform: closeAnimted.getTranslateTransform(),
        };
        const opacityStyle = { opacity: blurInActive ? opacityAnimated : 1 };
        const pressDisabled = !typeof onPress === 'function';
        return (
            <>
                <Animated.View
                    {...this.panResponder.panHandlers}
                    {...this.props}
                    style={[panStyle, styles.container, opacityStyle, style]}
                >

                    <TouchableOpacity
                        disabled={pressDisabled}
                        onPress={this.onPress}
                        activeOpacity={0.5}
                    >
                        {children}
                    </TouchableOpacity>
                </Animated.View>
                {
                    isShowClose && isCloseIcon && (
                        <Animated.View
                            pointerEvents="none"
                            style={[showStyle, closeStyle, styles.closeIcon]}
                        >
                            <Image tintColor={Colors.white} style={styles.icon} source={IconSource.ic_close_x_24} />

                        </Animated.View>
                    )
                }

            </>

        );
    }
}

DraggableComponent.defaultProps = {
    width: 0,
    height: 0,
    defaultPosition: { x: widthScreen, y: heightScreen },
    blurInActive: true,
    boundInside: {
        top: 16,
        left: 16,
        right: 16,
        bottom: heightScreen - ifIphoneX(30, 20) - 54 - ifIphoneX(34, 0) - 100,
        /*
        bottom: height of container:
        ifIphoneX(30, 20) -> stastus bar height
        54: button height at bottom
        ifIphoneX(34, 0): bottom space of iphone x
        100: layout ui
        */
    },
};
