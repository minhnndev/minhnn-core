import React, { Component } from 'react';
import {
    View,
    Animated,
    TouchableOpacity,
    Easing,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../../icon/Icon';

export default class RightHeader extends Component {
    constructor(props) {
        super(props);
        this.animated = new Animated.Value(0);
        this.state = {
            isLoading: false,
        };
    }

    runAnimation() {
        if (this.animated) {
            const { isLoading } = this.state;
            this.animated.setValue?.(0);
            Animated.timing(this.animated, {
                toValue: 4,
                duration: 1100,
                easing: Easing.linear,
            }).start((o) => {
                if (o.finished && isLoading) {
                    this.runAnimation();
                }
            });
        }
    }

    setLoading = (isLoading) => {
        this.setState(
            {
                isLoading,
            },
            () => this.runAnimation()
        );
    };

    showMore = () => {
        const { onAction } = this.props;
        onAction?.();
    };

    onClose = () => {
        const { onClose } = this.props;
        onClose?.();
    };

    renderSeeMore() {
        return (
            <View style={styles.wrapperDot}>
                <TouchableOpacity
                    ref={(ref) => {
                        this.fromView = ref;
                    }}
                    onPress={this.showMore}
                    style={styles.wrapperDotContent}
                    hitSlop={{
                        top: 10, right: 10, left: 10, bottom: 10
                    }}
                >
                    <Icon name="navigation_more_horiz" style={styles.iconDot} />
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const { style } = this.props;
        return (
            <View style={[styles.headerRight, style]}>
                {this.renderSeeMore()}
                <TouchableOpacity onPress={this.onClose} style={styles.closeButton}>
                    <Icon name="16_navigation_close_circle" style={styles.iconClose} />
                </TouchableOpacity>
            </View>
        );
    }
}

RightHeader.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onAction: PropTypes.func,
    onClose: PropTypes.func,
};

const styles = {
    wrapperDot: {
        width: '50%',
        // height: 18,
        justifyContent: 'center',
        borderRightColor: 'rgba(255, 255, 255, 0.35)',
        borderRightWidth: 1,
    },
    wrapperDotContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: { width: 4, height: 4, marginHorizontal: 1.5 },
    headerRight: {
        borderRadius: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        flexDirection: 'row',
        alignItems: 'center',
        width: 76,
        height: 28,
        marginRight: 10,
        marginLeft: 20,
    },
    closeButton: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    iconClose: { width: 18, height: 18 },
    iconDot: { width: 24, height: 24,},
};
