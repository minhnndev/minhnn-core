import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableHighlight,
  Text,
} from 'react-native';
import {Colors, Radius} from '@momo-kits/core';
// import {Radius} from '../../core';

class DefaultMarker extends React.Component {
  render() {
    const {
      enabled,
      markerStyle,
      pressed,
      pressedMarkerStyle,
      disabledMarkerStyle,
    } = this.props;
    return (
      <TouchableHighlight>
        <View
          style={
            enabled
              ? [
                  styles.markerStyle,
                  markerStyle,
                  pressed && styles.pressedMarkerStyle,
                  pressed && pressedMarkerStyle,
                ]
              : [styles.markerStyle, styles.disabled, disabledMarkerStyle]
          }
        />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  markerStyle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: Colors.white,
    backgroundColor: Colors.pink_05_b,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  pressedMarkerStyle: {
    ...Platform.select({
      web: {},
      ios: {},
      android: {
        height: 20,
        width: 20,
        borderRadius: 20,
      },
    }),
  },
  disabled: {
    backgroundColor: '#d3d3d3',
  },
});

export default DefaultMarker;
