import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    AppState
} from 'react-native';
import PropTypes, { number, shape } from 'prop-types';
import { Colors, Image } from '@momo-kits/core';

const SHADOW = 'rgba(0, 0, 0, 0.3)';
const TRANSPARENT = 'transparent';
const HEIGHT = Dimensions.get('window').height;
const topOffset = HEIGHT * 0.1;
const windowHeight = HEIGHT + topOffset;
const BORDER_RADIUS = 1;

const isImage = (data) => {
    if (typeof data === 'number' || (typeof data === 'string' && data.startsWith('http'))) return true;
    return false;
};

export default class Flake extends Component {
  _fallAnimation = null;

  _shakeAnimation = null;

  constructor(props) {
      super(props);

      this.state = {
          glyph: props.glyph || '❅',
          visible: props.visible || false,
          size: props.size || 12,
          amplitude: props.amplitude || 60, // 80,
          fallDuration: props.fallDuration || 10000,
          shakeDuration: props.shakeDuration || 4000,
          fallDelay: props.fallDelay || 0,
          shakeDelay: props.shakeDelay || 0,
          offset: props.offset || 0,
          translateY: new Animated.Value(0),
          translateX: new Animated.Value(0),
          appState: AppState.currentState,
      };
  }

  _handleAppStateChange = (nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // App is coming into foreground
          this._initAnimation();
      }
      if (this.state.appState.match(/^active|foreground/) && nextAppState === 'inactive') {
      // App is going into background
          this._stopAnimation();
      }
      this.setState({ appState: nextAppState });
  }

  _stopAnimation() {
      if (this._fallAnimation) {
          this._fallAnimation.stop();
          this._fallAnimation = null;
          this.setState({
              translateY: new Animated.Value(0),
          });
      }

      if (this._shakeAnimation) {
          this._shakeAnimation.stop();
          this._shakeAnimation = null;
          this.setState({
              translateX: new Animated.Value(0),
          });
      }
  }

  _initAnimation() {
      this._fallAnimation = Animated.loop(
          Animated.timing(
              this.state.translateY,
              {
                  toValue: 1,
                  easing: Easing.linear,
                  duration: this.state.fallDuration,
                  useNativeDriver: true,
              }
          )
      );

      this._shakeAnimation = Animated.loop(
          Animated.sequence([
              Animated.timing(
                  this.state.translateX,
                  {
                      toValue: 1,
                      easing: Easing.easeInOutSine,
                      duration: this.state.shakeDuration / 2,
                      useNativeDriver: true,
                  }
              ),
              Animated.timing(
                  this.state.translateX,
                  {
                      toValue: 0,
                      easing: Easing.easeInOutSine,
                      duration: this.state.shakeDuration / 2,
                      useNativeDriver: true,
                  }
              )
          ])
      );

      setTimeout(() => {
          this._fallAnimation && this._fallAnimation.start();
      }, this.state.fallDelay);

      setTimeout(() => {
          this._shakeAnimation && this._shakeAnimation.start();
      }, this.state.shakeDelay);
  }

  componentDidMount() {
      AppState.addEventListener('change', this._handleAppStateChange);
      this._initAnimation();
  }

  componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
      const { style } = this.props;
      const translateX = this.state.translateX.interpolate({
          inputRange: [0, 1],
          outputRange: [0, this.state.amplitude]
      });

      const translateY = this.state.translateY.interpolate({
          inputRange: [0, 1],
          outputRange: [0, windowHeight]
      });

      return isImage(this.state.glyph) ? (
          <Image
              style={[styles.image, {
                  width: this.state.size,
                  height: this.state.size,
                  left: this.state.offset,
                  transform: [{ translateX }, { translateY }]
              }, style]}
              source={this.state.glyph}
          />
      ) : (
          <Animated.Text style={[styles.text, {
              fontSize: this.state.size,
              left: this.state.offset,
              transform: [{ translateX }, { translateY }]
          }, style]}
          >
              {this.state.glyph}
          </Animated.Text>
      );
  }
}

Flake.propTypes = {
    glyph: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    visible: PropTypes.bool,
    size: PropTypes.number,
    offset: PropTypes.string,
    amplitude: PropTypes.number,
    fallDuration: PropTypes.number,
    shakeDuration: PropTypes.number,
    fallDelay: PropTypes.number,
    shakeDelay: PropTypes.number,
    style: shape({
        color: PropTypes.string,
    }),
};

const styles = StyleSheet.create({
    text: {
        top: -topOffset,
        height: windowHeight,
        color: Colors.white,
        backgroundColor: TRANSPARENT,
        textShadowColor: SHADOW,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: BORDER_RADIUS,
    },
    image: {
        top: -topOffset,
        // height: windowHeight,
    }
});
