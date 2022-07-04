import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import PropTypes from 'prop-types';
import {
    Colors, Text, IconSource, Image
} from '@momo-kits/core';

const CIRCLE_SIZE = 24;

const styles = StyleSheet.create({
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        // borderWidth: 1,
        // borderColor: Colors.sepia_05,
        borderRadius: CIRCLE_SIZE / 2,
        backgroundColor: 'white'
    },
    line: {
        height: 4,
        backgroundColor: 'white',
        // borderWidth: 1,
        // borderRadius: 1,
        // borderStyle: 'dashed',
        zIndex: 0,
        // marginTop: 8
    },
    topRight: {
        position: 'absolute',
        right: -1,
        top: -1,
        width: 1,
        height: '100%',
        backgroundColor: 'white',
        zIndex: 1
    },
    topLeft: {
        position: 'absolute',
        left: -1,
        top: -1,
        width: '100%',
        height: 1,
        backgroundColor: 'white',
        zIndex: 1
    },
    topLeftWidth: {
        position: 'absolute',
        left: -1,
        top: -1,
        width: 1,
        height: '100%',
        backgroundColor: 'white',
        zIndex: 1
    },
    circleRow: {
        position: 'absolute',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    circleColumn: {
        // position: 'absolute',
        justifyContent: 'space-between',
    },
    titleDefault: {
        color: Colors.black_12
    },
    titleActive: {
        color: Colors.black_17,
        fontWeight: 'bold'
    },
    containerStyle: {
        minHeight: CIRCLE_SIZE + 20 + CIRCLE_SIZE
    }
});

export default class Step extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };
    }

    onLayout = (e) => {
        this.setState({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });
    }

    renderLine = () => {
        const {
            lineColor, lineStyle, currentStep, data
        } = this.props;
        return (
            <View style={[styles.line, { borderColor: lineColor }, lineStyle]}>
                {/* <View style={styles.topLeft} />
                <View style={styles.topLeftWidth} />
                <View style={styles.topRight} /> */}
            </View>
        );
    }

    circle = (value, index) => {
        const {
            currentStep, tintColor, data, lineStyle, isNumber, iconActive,
            iconInActive, lineColorActive, lineColorInActive, bodyStyle, iconStyle, checkedPreviousStep, borderColorActive, borderColorInActive,
        } = this.props;
        const { width } = this.state;
        const icon = currentStep >= (index + 1) ? iconActive || IconSource.ic_step_active : iconInActive || IconSource.ic_step_coming;
        const textFontStyle = currentStep >= (index + 1) ? styles.titleActive : styles.titleDefault;
        const itemWidth = (width - CIRCLE_SIZE) / data?.length;
        const lineActive = currentStep >= (index + 1) ? lineColorActive || isNumber ? lineColorActive || Colors.pink_09 : Colors.sepia_05 : lineColorInActive || Colors.black_02;
        const lineWidth = (width - CIRCLE_SIZE) / (data.length - 1);
        const backgroundActive = currentStep >= (index + 1) ? Colors.pink_05_b : Colors.black_09;
        const borderColor = currentStep >= (index + 1) ? borderColorActive || Colors.pink_09 : borderColorInActive || Colors.pink_09;
        let left = 0;
        let textAlignStyle = { textAlign: 'center' };
        /**
         * item lefr
         */
        if (index === 0) {
            left = 0;
            textAlignStyle = { textAlign: 'left' };

            /**
             * item right
             */
        } else if (index === data?.length - 1) {
            left = -itemWidth + CIRCLE_SIZE;
            textAlignStyle = { textAlign: 'right' };
            /**
             * center item
             */
        } else { left = -itemWidth / 2 + CIRCLE_SIZE / 2; }
        const textStyle = [textAlignStyle, textFontStyle];

        return (
            <View key={index}>
                {
                    data?.length - 1 !== index && (
                        <View style={[styles.line, {
                            position: 'absolute',
                            top: 10,
                            backgroundColor: lineActive,
                            width: lineWidth,
                            height: 4,
                            marginTop: 0
                        }, lineStyle]}
                        />
                    )
                }
                {
                    (isNumber && !checkedPreviousStep) || (isNumber && checkedPreviousStep && index >= currentStep -1 ) ? (
                        <View style={{
                            width: CIRCLE_SIZE,
                            height: CIRCLE_SIZE,
                            borderRadius: CIRCLE_SIZE / 2,
                            backgroundColor: backgroundActive,
                            borderColor: borderColor,
                            borderWidth: 2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        >
                            <Text.SubTitle style={{ color: 'white' }} weight="bold">{index + 1}</Text.SubTitle>
                        </View>
                    ) : <Image source={icon} style={[styles.circle, { tintColor }, iconStyle]} />
                }

                <View style={{
                    position: 'absolute',
                    width: itemWidth,
                    left,
                    top: CIRCLE_SIZE + CIRCLE_SIZE / 4
                }}
                >
                    <Text.Caption style={[textStyle, bodyStyle]}>{value}</Text.Caption>
                </View>
            </View>
        );
    }

    circleColumn = (value, index) => {
        const {
            currentStep, tintColor, data, lineStyle, isNumber, iconActive,
            iconInActive, lineColorActive, lineColorInActive, bodyStyle, iconStyle
        } = this.props;
        const { height } = this.state;
        const icon = currentStep >= (index + 1) ? iconActive || IconSource.ic_step_active : iconInActive || IconSource.ic_step_coming;
        const textFontStyle = currentStep >= (index + 1) ? styles.titleActive : styles.titleDefault;
        const itemWidth = (height - CIRCLE_SIZE) / data?.length;
        const lineActive = currentStep >= (index + 1) ? lineColorActive || isNumber ? Colors.pink_09 : Colors.sepia_05 : lineColorInActive || Colors.black_02;
        const lineWidth = (height - CIRCLE_SIZE) / (data.length - 1);
        const backgroundActive = currentStep >= (index + 1) ? Colors.pink_05_b : Colors.black_09;
        let left = 0;
        let textAlignStyle = { textAlign: 'center' };
        /**
         * item lefr
         */
        if (index === 0) {
            left = 0;
            textAlignStyle = { textAlign: 'left' };

            /**
             * item right
             */
        } else if (index === data?.length - 1) {
            left = -itemWidth + CIRCLE_SIZE;
            textAlignStyle = { textAlign: 'right' };
            /**
             * center item
             */
        } else { left = -itemWidth / 2 + CIRCLE_SIZE / 2; }
        const textStyle = [textAlignStyle, textFontStyle];

        return (
            <View key={index}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {
                        isNumber ? (
                            <View style={{
                                width: CIRCLE_SIZE,
                                height: CIRCLE_SIZE,
                                borderRadius: CIRCLE_SIZE / 2,
                                backgroundColor: backgroundActive,
                                borderColor: Colors.pink_09,
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            >
                                {
                                    iconActive ? <Image source={iconActive} style={[styles.circle, { tintColor }, iconStyle]} /> : <Text.SubTitle style={{ color: 'white' }} weight="bold">{index + 1}</Text.SubTitle>
                                }
                            </View>
                        ) : <Image source={icon} style={[styles.circle, { tintColor }, iconStyle]} />
                    }
                    <Text.Caption style={[{ marginLeft: 10 }, textStyle, bodyStyle]}>{value}</Text.Caption>
                </View>

                {
                    data?.length - 1 !== index && (
                        <View style={[styles.line, {
                            left: 10,
                            backgroundColor: lineActive,
                            width: 4,
                            height: lineWidth,
                            marginTop: 0,
                        }, lineStyle]}
                        />
                    )
                }

            </View>
        );
    }

    renderCircle = () => {
        const { data = [], isVertical } = this.props;
        return data.map(isVertical ? this.circleColumn : this.circle);
    }

    render() {
        const { width, height } = this.state;
        const { style, isVertical } = this.props;
        return (
            <View style={[styles.containerStyle, style]} onLayout={this.onLayout}>
                {/* {this.renderLine()} */}
                {
                    isVertical ? (
                        <View style={[styles.circleColumn, { height }]}>
                            {this.renderCircle()}
                        </View>
                    ) : (
                        <View style={[styles.circleRow, { width }]}>
                            {this.renderCircle()}
                        </View>
                    )
                }

            </View>
        );
    }
}

Step.propTypes = {
    data: PropTypes.arrayOf(PropTypes.string),
    currentStep: PropTypes.number,
    tintColor: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    isNumber: PropTypes.bool,
    isVertical: PropTypes.bool,
    iconActive: PropTypes.any,
    iconInActive: PropTypes.any,
    lineColorActive: PropTypes.string,
    lineColorInActive: PropTypes.string,
    bodyStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    checkedPreviousStep: PropTypes.bool,
    borderColorActive: PropTypes.string,
    borderColorInActive: PropTypes.string,
};

Step.defaultProps = {
    data: [],
    currentStep: 0,
    tintColor: Colors.sepia_05,
    checkedPreviousStep: false,
};