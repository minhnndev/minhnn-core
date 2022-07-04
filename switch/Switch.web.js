/* eslint-disable indent */
import React, { Component } from 'react';
import {
    Animated, TouchableWithoutFeedback, View
} from 'react-native';
import { debounce, get } from 'lodash';
import PropTypes from 'prop-types';
import ValueUtil from '../../core/utils/ValueUtil';
import Text from '../../core/components/typography';
import Colors from '../../core/colors';

const SWITCH_WIDTH_DEFAULT = 40;
const SWITCH_HEIGHT_DEFAULT = 24;
const CIRCLE_COLOR_DEFAULT = 'white';
const CIRCLE_MARGIN_DEFAULT = 5;
const CIRCLE_SIZE_DEFAULT = 14;
const LEFT_DEFAULT = SWITCH_WIDTH_DEFAULT - CIRCLE_SIZE_DEFAULT - CIRCLE_MARGIN_DEFAULT;

const LabelPosition = {
    left: 'left',
    right: 'right',
};

const styles = {
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    switch: {
        width: SWITCH_WIDTH_DEFAULT,
        height: SWITCH_HEIGHT_DEFAULT,
        borderRadius: SWITCH_WIDTH_DEFAULT / 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        width: CIRCLE_SIZE_DEFAULT,
        height: CIRCLE_SIZE_DEFAULT,
        borderRadius: CIRCLE_SIZE_DEFAULT / 2,
        position: 'absolute',
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeText: {
        fontSize: 10,
        color: Colors.white,
        position: 'absolute',
        left: 6
    },
    inActiveText: {
        fontSize: 10,
        color: Colors.white,
        position: 'absolute',
        right: 6
    },
    marginLeft: {
        marginLeft: 10
    },
    marginRight: {
        marginRight: 10
    },
    title: {
        // fontSize: 15
    },
    disableLabel: {
        color: Colors.disabled
    }
};

export default class Switch extends Component {
    constructor(props) {
        super(props);
        this.duration = props.duration;
        const value = ValueUtil.getBool(props.value);
        const animated = new Animated.Value(value ? 1 : 0);
        this.state = {
            animated,
            value: ValueUtil.getBool(props.value),
            disabled: ValueUtil.getBool(props.disabled),
        };
        this.left = animated.interpolate({
            inputRange: [0, 1],
            outputRange: [CIRCLE_MARGIN_DEFAULT, LEFT_DEFAULT],
            extrapolate: 'clamp'
        });
        this.opacityTextActive = animated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        });
        this.opacityTextInactive = animated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });
        this.backgroundColor = animated.interpolate({
            inputRange: [0, 1],
            outputRange: [get(props, 'inactiveStyle.backgroundColor', Colors.switch_inactive_color), get(props, 'activeStyle.backgroundColor', Colors.pink_05_b)],
            extrapolate: 'clamp'
        });
        this.disabledBackgroundColor = animated.interpolate({
            inputRange: [0, 1],
            outputRange: [get(props, 'disableInActiveStyle.backgroundColor', Colors.switch_inactive_color), get(props, 'acitveDisableStyle.backgroundColor', Colors.pink_09)],
            extrapolate: 'clamp'
        });
    }

    componentDidMount() {
        if (this.getValue()) {
            Animated.timing(this.getAnimated(), { toValue: 1, duration: this.duration }).start();
        } else {
            Animated.timing(this.getAnimated(), { toValue: 0, duration: this.duration }).start();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.value !== null && nextProps !== this.props) {
            let needUpdate = false;
            if (ValueUtil.getBool(nextProps.value) !== this.getValue()
                || ValueUtil.getBool(nextProps.disabled) !== this.isDisabled()) {
                needUpdate = true;
            }
            if (needUpdate) {
                const value = ValueUtil.getBool(nextProps.value);
                this.setState({
                    value,
                    disabled: ValueUtil.getBool(nextProps.disabled)
                }, () => {
                    if (value) {
                        Animated.timing(this.getAnimated(), { toValue: 1, duration: this.duration }).start();
                    } else {
                        Animated.timing(this.getAnimated(), { toValue: 0, duration: this.duration }).start();
                    }
                });
                return true;
            }
        }
        return nextState !== this.state;
    }

    getAnimated = () => {
        const { animated } = this.state;
        return animated;
    }

    getValue = () => {
        const { value } = this.state;
        return value;
    }

    setValue = (value) => {
        if (this.isDisabled()) {
            return;
        }
        this.setState({ value }, () => {
            if (value) {
                Animated.timing(this.getAnimated(), { toValue: 1, duration: this.duration }).start();
            } else {
                Animated.timing(this.getAnimated(), { toValue: 0, duration: this.duration }).start();
            }
            this.callback(value);
        });
    }

    isDisabled = () => {
        const { disabled } = this.state;
        return disabled;
    }

    callback = (value) => {
        const { onChange } = this.props;
        if (onChange && typeof onChange === 'function') {
            onChange(value);
        }
    }

    changeValue = () => {
        const { value } = this.state;
        this.setValue(!value);
    }

    getCircleColorAnimated = () => {
        const colorActive = CIRCLE_COLOR_DEFAULT;
        const colorInActive = CIRCLE_COLOR_DEFAULT;

        if (CIRCLE_COLOR_DEFAULT === colorActive && CIRCLE_COLOR_DEFAULT === colorInActive) {
            return CIRCLE_COLOR_DEFAULT;
        }

        return this.getAnimated().interpolate({
            inputRange: [0, 1],
            outputRange: [colorInActive, colorActive],
            extrapolate: 'clamp'
        });
    }

    onPressDebounce = debounce(this.changeValue, this.duration, { leading: true, trailing: false });

    render() {
        const {
            style, activeStyle, inactiveStyle, switchStyle, textActive, textInActive, disableActiveStyle, disableInActiveStyle
        } = this.props;

        return (
            <TouchableWithoutFeedback onPress={this.onPressDebounce}>
                <View style={[styles.container, style]}>
                    {this.renderLabel(LabelPosition.left)}
                    <Animated.View
                        style={[styles.switch, { backgroundColor: this.isDisabled() ? this.disabledBackgroundColor : this.backgroundColor }, switchStyle]}
                    >
                        {this.renderSwitch()}
                        <Animated.Text
                            style={[styles.activeText,
                                { opacity: this.opacityTextActive, backgroundColor: this.isDisabled() ? this.disabledBackgroundColor : this.backgroundColor },
                                activeStyle,
                            this.isDisabled() && disableActiveStyle]}
                        >
                            {textActive}
                        </Animated.Text>
                        <Animated.Text
                            style={[styles.inActiveText,
                                { opacity: this.opacityTextInactive, backgroundColor: this.isDisabled() ? this.disabledBackgroundColor : this.backgroundColor },
                                inactiveStyle,
                            this.isDisabled() && disableInActiveStyle]}
                        >
                            {textInActive}
                        </Animated.Text>
                    </Animated.View>
                    {this.renderLabel(LabelPosition.right)}
                </View>

            </TouchableWithoutFeedback>
        );
    }

    renderSwitch = () => (
        <Animated.View style={[
            styles.circle,
            { backgroundColor: this.getCircleColorAnimated() },
            { left: this.left }]}
        >
            <Animated.View style={{
                backgroundColor: this.isDisabled() ? this.disabledBackgroundColor : this.backgroundColor,
                width: 7,
                height: 7,
                borderRadius: 4
            }}
            />
        </Animated.View>
    )

    renderLabel = (direction) => {
        const {
 title, position, numberOfLines, disableTitleStyle, titleStyle
} = this.props;

        if (!title) {
            return null;
        }

        if ((direction !== LabelPosition.left && !position)
            || (position && direction !== position)) {
            return null;
        }

        return (
            <Text.Title
                style={[direction === LabelPosition.right ? styles.marginLeft : styles.marginRight,
                styles.title,
                titleStyle,
                this.isDisabled() ? disableTitleStyle || styles.disableLabel : null]}
                numberOfLines={numberOfLines}
            >
                {title}
            </Text.Title>
        );
    }
}

Switch.propTypes = {
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    switchStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    title: PropTypes.string,
    titleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    position: PropTypes.string,
    numberOfLines: PropTypes.number,
    disableTitleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    textActive: PropTypes.string,
    activeStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    disableActiveStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    textInActive: PropTypes.string,
    inactiveStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    disableInActiveStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    disabled: PropTypes.bool,
    value: PropTypes.bool,
    onChange: PropTypes.func,
    duration: PropTypes.number
};

Switch.defaultProps = {
    style: {},
    switchStyle: {},
    disabled: false,
    value: null,
    title: '',
    titleStyle: {},
    position: 'left',
    numberOfLines: 1,
    disableTitleStyle: {},
    textActive: '',
    activeStyle: {},
    textInActive: '',
    inactiveStyle: {},
    duration: 200,
    disableActiveStyle: {},
    disableInActiveStyle: {}
};
