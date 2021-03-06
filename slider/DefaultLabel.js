import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Text } from '@momo-kits/core';

const sliderRadius = 3;
const width = 50;
export default class DefaultLabel extends React.Component {
    render() {
        const {
            oneMarkerValue,
            twoMarkerValue,
            oneMarkerLeftPosition,
            twoMarkerLeftPosition,
            oneMarkerPressed,
            twoMarkerPressed,
        } = this.props;

        return (
            <View style={{ position: 'relative' }}>
                {
                    Number.isFinite(oneMarkerLeftPosition)
                && Number.isFinite(oneMarkerValue)
                && (
                    <View
                        style={[
                            styles.sliderLabel,
                            { left: oneMarkerLeftPosition - width / 2 + sliderRadius },
                            oneMarkerPressed && styles.markerPressed,
                        ]}
                    >
                        <Text.SubTitle style={styles.sliderLabelText}>{oneMarkerValue}</Text.SubTitle>
                    </View>
                )
                }

                {
                    Number.isFinite(twoMarkerLeftPosition)
                  && Number.isFinite(twoMarkerValue)
                  && (
                      <View
                          style={[
                              styles.sliderLabel,
                              { left: twoMarkerLeftPosition - width / 2 + sliderRadius },
                              twoMarkerPressed && styles.markerPressed,
                          ]}
                      >
                          <Text.SubTitle style={styles.sliderLabelText}>{twoMarkerValue}</Text.SubTitle>
                      </View>
                  )
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sliderLabel: {
        position: 'absolute',
        bottom: 0,
        minWidth: width,
        padding: 8,
        backgroundColor: '#f1f1f1',
    },
    sliderLabelText: {
        alignItems: 'center',
        textAlign: 'center',
        fontStyle: 'normal',
        // fontSize: 11,
    },
    markerPressed: {
        borderWidth: 2,
        borderColor: '#999',
    },
});

DefaultLabel.propTypes = {
    oneMarkerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    twoMarkerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    oneMarkerLeftPosition: PropTypes.number,
    twoMarkerLeftPosition: PropTypes.number,

    oneMarkerPressed: PropTypes.bool,
    twoMarkerPressed: PropTypes.bool,
};
