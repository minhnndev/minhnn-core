import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  PanResponder,
  View,
  I18nManager,
  ImageBackground,
  Text,
} from 'react-native';
import {get} from 'lodash';
import {Colors, Spacing} from '@momo-kits/core';
import DefaultMarker from './DefaultMarker';
import DefaultLabel from './DefaultLabel';
import {createArray, valueToPosition, positionToValue} from './converters';

export default class Slider extends Component {
  constructor(props) {
    super(props);
    const {optionsArray, min, max, step, length, values} = this.props;
    this.optionsArray = optionsArray || createArray(min, max, step);
    const defaultSliderLength = length;
    this.stepLength = defaultSliderLength / this.optionsArray.length;
    const initialValues = values.map(value =>
      valueToPosition(value, this.optionsArray, defaultSliderLength),
    );
    console.warn('initialValues', initialValues);
    this.state = {
      valueOne: values[0],
      valueTwo: values[1],
      pastOne: initialValues[0],
      pastTwo: initialValues[1],
      positionOne: initialValues[0],
      positionTwo: initialValues[1],
      sliderLength: defaultSliderLength,
    };
    this.subscribePanResponder();
  }

  subscribePanResponder = () => {
    const customPanResponder = (start, move, end) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: () => start(),
        onPanResponderMove: (evt, gestureState) => move(gestureState),
        onPanResponderTerminationRequest: () => false,
        onPanResponderRelease: (evt, gestureState) => end(gestureState),
        onPanResponderTerminate: (evt, gestureState) => end(gestureState),
        onShouldBlockNativeResponder: () => true,
      });

    this._panResponderBetween = customPanResponder(
      gestureState => {
        this.startOne(gestureState);
        this.startTwo(gestureState);
      },
      gestureState => {
        this.moveOne(gestureState);
        this.moveTwo(gestureState);
      },
      gestureState => {
        this.endOne(gestureState);
        this.endTwo(gestureState);
      },
    );

    this._panResponderOne = customPanResponder(
      this.startOne,
      this.moveOne,
      this.endOne,
    );
    this._panResponderTwo = customPanResponder(
      this.startTwo,
      this.moveTwo,
      this.endTwo,
    );
  };

  startOne = () => {
    const {enabledOne, onChangeStart} = this.props;
    const {onePressed} = this.state;
    if (enabledOne) {
      onChangeStart();
      this.setState({
        onePressed: !onePressed,
      });
    }
  };

  startTwo = () => {
    const {enabledTwo, onChangeStart} = this.props;
    const {twoPressed} = this.state;
    if (enabledTwo) {
      onChangeStart();
      this.setState({
        twoPressed: !twoPressed,
      });
    }
  };

  moveOne = gestureState => {
    const {
      enabledOne,
      vertical,
      allowOverlap,
      minMarkerOverlapDistance,
      //   sliderLength,
      touchDimensions,
      snapped,
      onChange,
      onMarkersPosition,
      allowRange = [],
      min,
      max,
    } = this.props;
    const {pastOne, positionTwo, valueOne, valueTwo, sliderLength} = this.state;
    if (!enabledOne) {
      return;
    }

    const accumDistance = vertical ? -gestureState.dy : gestureState.dx;
    const accumDistanceDisplacement = vertical
      ? gestureState.dx
      : gestureState.dy;

    const unconfined = I18nManager.isRTL
      ? pastOne - accumDistance
      : accumDistance + pastOne;
    const bottom = 0;
    const trueTop =
      positionTwo -
      (allowOverlap
        ? 0
        : minMarkerOverlapDistance > 0
        ? minMarkerOverlapDistance
        : this.stepLength);
    const top = trueTop === 0 ? 0 : trueTop || sliderLength;
    const confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    const {slipDisplacement} = touchDimensions;

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      const value = positionToValue(confined, this.optionsArray, sliderLength);

      if (allowRange?.length > 0 && value < get(allowRange, '[0]', min)) return;
      if (allowRange?.length > 1 && value > get(allowRange, '[1]', max)) return;

      const snappedValue = valueToPosition(
        value,
        this.optionsArray,
        sliderLength,
      );

      this.setState({
        positionOne: snapped ? snappedValue : confined,
      });

      if (value !== valueOne) {
        this.setState(
          {
            valueOne: value,
          },
          () => {
            const {valueOne: newValueOne, positionOne: newPositionOne} =
              this.state;
            const change = [newValueOne];
            if (valueTwo) {
              change.push(valueTwo);
            }
            onChange(change);

            onMarkersPosition([newPositionOne, positionTwo]);
          },
        );
      }
    }
  };

  moveTwo = gestureState => {
    const {
      enabledTwo,
      vertical,
      allowOverlap,
      minMarkerOverlapDistance,
      //   sliderLength,
      touchDimensions,
      snapped,
      onChange,
      onMarkersPosition,
    } = this.props;
    const {pastTwo, positionOne, sliderLength, valueTwo, valueOne} = this.state;
    if (!enabledTwo) {
      return;
    }

    const accumDistance = vertical ? -gestureState.dy : gestureState.dx;
    const accumDistanceDisplacement = vertical
      ? gestureState.dx
      : gestureState.dy;

    const unconfined = I18nManager.isRTL
      ? pastTwo - accumDistance
      : accumDistance + pastTwo;
    const bottom =
      positionOne +
      (allowOverlap
        ? 0
        : minMarkerOverlapDistance > 0
        ? minMarkerOverlapDistance
        : this.stepLength);
    const top = sliderLength;
    const confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    const {slipDisplacement} = touchDimensions;

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      const value = positionToValue(confined, this.optionsArray, sliderLength);

      const snappedValue = valueToPosition(
        value,
        this.optionsArray,
        sliderLength,
      );

      this.setState({
        positionTwo: snapped ? snappedValue : confined,
      });

      if (value !== valueTwo) {
        this.setState(
          {
            valueTwo: value,
          },
          () => {
            console.log(valueOne);
            const {valueTwo: newValueTwo, positionTwo: newPositionTwo} =
              this.state;
            onChange([valueOne, newValueTwo]);

            onMarkersPosition([positionOne, newPositionTwo]);
          },
        );
      }
    }
  };

  endOne = gestureState => {
    const {onToggleOne, onChangeFinish} = this.props;
    const {positionOne, onePressed, valueOne, valueTwo} = this.state;
    if (gestureState.moveX === 0 && onToggleOne) {
      onToggleOne();
      return;
    }

    this.setState(
      {
        pastOne: positionOne,
        onePressed: !onePressed,
      },
      () => {
        const change = [valueOne];
        if (valueTwo) {
          change.push(valueTwo);
        }
        onChangeFinish(change);
      },
    );
  };

  endTwo = gestureState => {
    const {onToggleTwo, onChangeFinish} = this.props;
    const {twoPressed, positionTwo, valueOne, valueTwo} = this.state;
    if (gestureState.moveX === 0 && onToggleTwo) {
      onToggleTwo();
      return;
    }

    this.setState(
      {
        twoPressed: !twoPressed,
        pastTwo: positionTwo,
      },
      () => {
        onChangeFinish([valueOne, valueTwo]);
      },
    );
  };

  componentDidUpdate(prevProps, prevState) {
    const {positionOne: prevPositionOne, positionTwo: prevPositionTwo} =
      prevState;

    const {positionOne, positionTwo, onePressed, twoPressed, sliderLength} =
      this.state;
    const {onMarkersPosition, min, max, step, values, optionsArray} =
      this.props;

    if (
      typeof positionOne === 'undefined' &&
      typeof positionTwo !== 'undefined'
    ) {
      return;
    }

    if (positionOne !== prevPositionOne || positionTwo !== prevPositionTwo) {
      onMarkersPosition([positionOne, positionTwo]);
    }

    if (onePressed || twoPressed) {
      return;
    }

    const nextState = {};
    if (
      prevProps.min !== min ||
      prevProps.max !== max ||
      prevProps.step !== step ||
      prevProps.values[0] !== values[0] ||
      prevState.sliderLength !== sliderLength ||
      prevProps.values[1] !== values[1] ||
      (prevState.sliderLength !== sliderLength && prevProps.values[1])
    ) {
      this.optionsArray = optionsArray || createArray(min, max, step);

      this.stepLength = sliderLength / this.optionsArray.length;

      const positionOneValue = valueToPosition(
        values[0],
        this.optionsArray,
        sliderLength,
      );
      // eslint-disable-next-line prefer-destructuring
      nextState.valueOne = values[0];
      nextState.pastOne = positionOneValue;
      nextState.positionOne = positionOneValue;

      const positionTwoValue = valueToPosition(
        values[1],
        this.optionsArray,
        sliderLength,
      );
      // eslint-disable-next-line prefer-destructuring
      nextState.valueTwo = values[1];
      nextState.pastTwo = positionTwoValue;
      nextState.positionTwo = positionTwoValue;

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(nextState);
    }
  }

  onContentLayout(e) {
    const {vertical, length} = this.props;
    if (!length) {
      const layoutLength = vertical
        ? e.nativeEvent.layout.height
        : e.nativeEvent.layout.width;
      this.setState({
        sliderLength: layoutLength,
      });
    }
  }

  render() {
    const {
      positionOne,
      positionTwo,
      onePressed,
      valueOne,
      twoPressed,
      valueTwo,
      sliderLength,
    } = this.state;
    const {
      style,
      selectedStyle,
      unselectedStyle,
      //   sliderLength,
      markerOffsetX,
      markerOffsetY,
      values,
      customMarker,
      customMarkerLeft,
      customMarkerRight,
      isMarkersSeparated = false,
      customLabel,
      touchDimensions,
      containerStyle,
      vertical,
      trackStyle,
      markerContainerStyle,
      enabledOne,
      enabledTwo,
      markerStyle,
      pressedMarkerStyle,
      disabledMarkerStyle,
      valuePrefix,
      valueSuffix,
      enableLabel,
      imageBackgroundSource,
    } = this.props;
    const twoMarkers = values.length === 2; // when allowOverlap, positionTwo could be 0, identified as string '0' and throwing 'RawText 0 needs to be wrapped in <Text>' error

    const trackOneLength = positionOne;
    const trackOneStyle = twoMarkers
      ? unselectedStyle
      : selectedStyle || styles.selectedTrack;
    const trackThreeLength = twoMarkers ? sliderLength - positionTwo : 0;
    const trackThreeStyle = unselectedStyle;
    const trackTwoLength = sliderLength - trackOneLength - trackThreeLength;
    const trackTwoStyle = twoMarkers
      ? selectedStyle || styles.selectedTrack
      : unselectedStyle;
    const Marker = customMarker;

    const MarkerLeft = customMarkerLeft;
    const MarkerRight = customMarkerRight;

    const Label = customLabel;

    const {borderRadius} = touchDimensions;
    const touchStyle = {
      borderRadius: borderRadius || 0,
    };

    const markerContainerOne = {
      top: markerOffsetY - 24,
      left: trackOneLength + markerOffsetX - 24,
    };

    const markerContainerTwo = {
      top: markerOffsetY - 24,
      right: trackThreeLength - markerOffsetX - 24,
    };

    const newContainerStyle = [styles.container, containerStyle];

    if (vertical) {
      newContainerStyle.push({
        transform: [{rotate: '-90deg'}],
      });
    }

    const body = (
      <View style={{alignItems: 'center'}}>
        <View style={[styles.fullTrack, {width: sliderLength}]}>
          <View
            style={[
              styles.track,
              trackStyle,
              trackOneStyle,
              {width: trackOneLength},
            ]}
          />
          <View
            style={[
              styles.track,
              trackStyle,
              trackTwoStyle,
              {width: trackTwoLength},
            ]}
            {...(twoMarkers ? this._panResponderBetween.panHandlers : {})}
          />
          {twoMarkers && (
            <View
              style={[
                styles.track,
                trackStyle,
                trackThreeStyle,
                {width: trackThreeLength},
              ]}
            />
          )}
          <View
            style={[
              styles.markerContainer,
              markerContainerOne,
              markerContainerStyle,
              positionOne > sliderLength / 2 && styles.topMarkerContainer,
            ]}>
            <View
              style={[styles.touch, touchStyle]}
              ref={component => (this._markerOne = component)}
              {...this._panResponderOne.panHandlers}>
              {isMarkersSeparated === false ? (
                <>
                  {onePressed && (
                    <View style={styles.valueContainer}>
                      <Text>{valueOne}</Text>
                    </View>
                  )}
                  <Marker
                    enabled={enabledOne}
                    pressed={onePressed}
                    markerStyle={markerStyle}
                    pressedMarkerStyle={pressedMarkerStyle}
                    disabledMarkerStyle={disabledMarkerStyle}
                    currentValue={valueOne}
                    valuePrefix={valuePrefix}
                    valueSuffix={valueSuffix}
                  />
                </>
              ) : (
                <>
                  {onePressed && (
                    <View style={styles.valueContainer}>
                      <Text>{valueTwo}</Text>
                    </View>
                  )}
                  <MarkerLeft
                    enabled={enabledOne}
                    pressed={onePressed}
                    markerStyle={markerStyle}
                    pressedMarkerStyle={pressedMarkerStyle}
                    disabledMarkerStyle={disabledMarkerStyle}
                    currentValue={valueOne}
                    valuePrefix={valuePrefix}
                    valueSuffix={valueSuffix}
                  />
                </>
              )}
            </View>
          </View>
          {twoMarkers && positionOne !== sliderLength && (
            <View
              style={[
                styles.markerContainer,
                markerContainerTwo,
                markerContainerStyle,
              ]}>
              <View
                style={[styles.touch, touchStyle]}
                ref={component => (this._markerTwo = component)}
                {...this._panResponderTwo.panHandlers}>
                {isMarkersSeparated === false ? (
                  <>
                    {twoPressed && (
                      <View style={styles.valueContainer}>
                        <Text>{valueTwo}</Text>
                      </View>
                    )}
                    <Marker
                      pressed={twoPressed}
                      markerStyle={markerStyle}
                      pressedMarkerStyle={pressedMarkerStyle}
                      disabledMarkerStyle={disabledMarkerStyle}
                      currentValue={valueTwo}
                      enabled={enabledTwo}
                      valuePrefix={valuePrefix}
                      valueSuffix={valueSuffix}
                    />
                  </>
                ) : (
                  <>
                    {twoPressed && (
                      <View style={styles.valueContainer}>
                        <Text>{valueTwo}</Text>
                      </View>
                    )}
                    <MarkerRight
                      pressed={twoPressed}
                      markerStyle={markerStyle}
                      pressedMarkerStyle={pressedMarkerStyle}
                      disabledMarkerStyle={disabledMarkerStyle}
                      currentValue={valueTwo}
                      enabled={enabledTwo}
                      valuePrefix={valuePrefix}
                      valueSuffix={valueSuffix}
                    />
                  </>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    );

    return (
      <View style={style} onLayout={e => this.onContentLayout(e)}>
        {enableLabel && (
          <Label
            oneMarkerValue={valueOne}
            twoMarkerValue={valueTwo}
            oneMarkerLeftPosition={positionOne}
            twoMarkerLeftPosition={positionTwo}
            oneMarkerPressed={onePressed}
            twoMarkerPressed={twoPressed}
          />
        )}
        {imageBackgroundSource && (
          <ImageBackground
            source={imageBackgroundSource}
            style={[styles.full, newContainerStyle]}>
            {body}
          </ImageBackground>
        )}
        {!imageBackgroundSource && (
          <View style={newContainerStyle}>{body}</View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 50,
    justifyContent: 'center',
  },
  fullTrack: {
    flexDirection: 'row',
  },
  track: {
    height: 4,
    backgroundColor: Colors.black_03,
    borderRadius: 2,
  },
  selectedTrack: {
    backgroundColor: Colors.pink_05_b,
  },
  markerContainer: {
    position: 'absolute',
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMarkerContainer: {
    zIndex: 1,
  },
  touch: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  full: {width: '100%', height: '100%'},
  valueContainer: {
    width: 40,
    height: 32,
    borderRadius: Spacing.S,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -36,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.24,
    shadowRadius: 6,
    elevation: 12,
  },
});

Slider.defaultProps = {
  values: [0],
  onChangeStart: () => {},
  onChange: () => {},
  onChangeFinish: () => {},
  onMarkersPosition: () => {},
  step: 1,
  min: 0,
  max: 10,
  touchDimensions: {
    height: 50,
    width: 50,
    borderRadius: 15,
    slipDisplacement: 200,
  },
  customMarker: DefaultMarker,
  customMarkerLeft: DefaultMarker,
  customMarkerRight: DefaultMarker,
  customLabel: DefaultLabel,
  markerOffsetX: 0,
  markerOffsetY: 0,
  onToggleOne: undefined,
  onToggleTwo: undefined,
  enabledOne: true,
  enabledTwo: true,
  allowOverlap: false,
  snapped: false,
  vertical: false,
  minMarkerOverlapDistance: 0,
  length: 280,
};

Slider.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  selectedStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  unselectedStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  markerOffsetX: PropTypes.number,
  markerOffsetY: PropTypes.number,
  values: PropTypes.arrayOf(PropTypes.number),
  customMarker: PropTypes.func,
  customMarkerLeft: PropTypes.func,
  customMarkerRight: PropTypes.func,
  isMarkersSeparated: PropTypes.bool,
  touchDimensions: PropTypes.object,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  vertical: PropTypes.bool,
  trackStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  markerContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  enabledOne: PropTypes.bool,
  enabledTwo: PropTypes.bool,
  onChangeStart: PropTypes.func,
  onChange: PropTypes.func,
  onChangeFinish: PropTypes.func,
  onMarkersPosition: PropTypes.func,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  customLabel: PropTypes.any,
  onToggleOne: PropTypes.func,
  onToggleTwo: PropTypes.func,
  allowOverlap: PropTypes.bool,
  snapped: PropTypes.bool,
  minMarkerOverlapDistance: PropTypes.number,
  length: PropTypes.number,
  allowRange: PropTypes.arrayOf(PropTypes.number),
};
