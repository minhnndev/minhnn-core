import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Snowflake from './Flake';

const TRANSPARENT = 'transparent';
const windowHeight = Dimensions.get('window').height + (Dimensions.get('window').height * 0.1);

const flakes = ({ content = '❆', size = 14 }) => [
    {
        glyph: content, size, offset: '1%', fallDelay: 0, shakeDelay: 0,
    },
    {
        glyph: content, size, offset: '5%', fallDelay: 1000, shakeDelay: 1000,
    },
    {
        glyph: content, size, offset: '10%', fallDelay: 6000, shakeDelay: 500,
    },
    {
        glyph: content, size, offset: '15%', fallDelay: 4000, shakeDelay: 2000,
    },
    {
        glyph: content, size, offset: '20%', fallDelay: 2000, shakeDelay: 2000,
    },
    {
        glyph: content, size, offset: '25%', fallDelay: 8000, shakeDelay: 3000,
    },
    {
        glyph: content, size, offset: '30%', fallDelay: 6000, shakeDelay: 2000,
    },
    {
        glyph: content, size, offset: '35%', fallDelay: 2500, shakeDelay: 1000,
    },
    {
        glyph: content, size, offset: '40%', fallDelay: 3000, shakeDelay: 1500,
    },
    {
        glyph: content, size, offset: '45%', fallDelay: 5900, shakeDelay: 500,
    },
    {
        glyph: content, size, offset: '50%', fallDelay: 3400, shakeDelay: 1700,
    },
    {
        glyph: content, size, offset: '55%', fallDelay: 1900, shakeDelay: 4000,
    },
    {
        glyph: content, size, offset: '60%', fallDelay: 3400, shakeDelay: 900,
    },
    {
        glyph: content, size, offset: '65%', fallDelay: 750, shakeDelay: 2500,
    },
    {
        glyph: content, size, offset: '70%', fallDelay: 4700, shakeDelay: 3000,
    },
];

export default class Effect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startRun: false
        };
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.setState({
                startRun: true
            });
        }, 1000);
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    render() {
        const { startRun } = this.state;
        if (!startRun) { return null; }
        const {
            style, data, content, size
        } = this.props;
        const dataflakes = data || flakes({ content, size });
        return (
            <View style={styles.view} pointerEvents="none">
                {
                    dataflakes.map((flake, i) => {
                        const {
                            glyph, size: s, offset, fallDelay, shakeDelay
                        } = flake;
                        return (
                            <Snowflake
                                key={`snowflake-${i}`}
                                glyph={glyph}
                                size={s}
                                offset={offset}
                                fallDelay={fallDelay}
                                shakeDelay={shakeDelay}
                                style={style}
                            />
                        );
                    })
                }
            </View>
        );
    }
}

Effect.propTypes = {
    data: PropTypes.array,
    content: PropTypes.any,
    size: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

Effect.defaultProps = {

};

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        zIndex: 9999,
        elevation: 9999,
        position: 'absolute',
        top: 0,
        left: -30,
        width: Dimensions.get('window').width + 30,
        height: windowHeight,
        backgroundColor: TRANSPARENT
    }
});
