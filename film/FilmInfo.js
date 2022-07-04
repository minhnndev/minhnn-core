/* eslint-disable indent */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, TouchableOpacity
} from 'react-native';
import {
 Colors, Text, IconSource, Button, Image
} from '@momo-kits/core';

const filmImageWidth = 70;
const filmImageHeight = 90;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
    },
    containerDark: {
        backgroundColor: Colors.black,
        padding: 6
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        flex: 1
    },
    title: {
        color: '#222222',
        // fontSize: 14,
        flex: 1
    },
    body: {
        color: Colors.brown_grey_three,
        // fontSize: 12,
        marginTop: 2
    },
    button: {

    },
    date: {
        marginTop: 2,
        backgroundColor: Colors.background_gray,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    dateText: {
        color: '#222222',
        // fontSize: 10,
        lineHeight: 12,
        textAlignVertical: 'center',
        marginVertical: 3
    },
    imageContainer: {
        width: filmImageWidth,
        height: filmImageHeight,
        borderRadius: 4,
        marginRight: 10,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    image: {
        width: filmImageWidth - 5,
        height: filmImageHeight - 5,
        borderRadius: 4,
        position: 'absolute'
    },
    minYearsOld: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        borderRadius: 16,
        width: 32,
        height: 20,
    },
    minYearsOldText: {
        color: 'white',
        // fontSize: 10,
        lineHeight: 12,
        paddingVertical: 3
    },
    orderImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 20,
        width: 60
    },
    left: {
        marginTop: 3,
        marginRight: 10,
        flex: 1
    },
    titleLight: {
        color: 'white'
    },
    bodyLight: {
        color: Colors.light_periwinkle_three
    },
    buttonStyle: {
        backgroundColor: Colors.lipstick,
        height: 30,
        borderRadius: 4
    },
    rightIcon: {
        width: 24,
        height: 24,
        tintColor: Colors.third_text_color,
        position: 'absolute',
        right: 10,
    }
});

export default class FilmInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingResource: true
        };
    }

    yearOldColorMap = () => {
        const { minYearsOld } = this.props;
        switch (minYearsOld) {
            case 'C18': return Colors.min_years_old_c_18;
            case 'P': return Colors.min_years_old_p;
            case 'C16':
            case 'C13': return Colors.min_years_old_under_18;
            default: return Colors.primary;
        }
    }

    onLoadEnd = () => {
        this.setState({ loadingResource: false });
    }

    onError = () => {
        this.setState({ loadingResource: true });
    }

    render() {
        const {
            button, source, minYearsOld, title, body, date, light, onPress, style, rightIcon, flashIcon
        } = this.props;
        const { loadingResource } = this.state;
        const minYearsOldBackgroundColor = this.yearOldColorMap();
        return (
            <TouchableOpacity activeOpacity={button ? 1 : 0.5} onPress={onPress}>
                <View style={[styles.container, light ? styles.containerDark : {}, style]}>
                    <View style={styles.rowContainer}>
                        {source ? (
                            <View style={styles.imageContainer}>
                                {loadingResource ? <Image style={styles.image} source={IconSource.ic_cinema_poster} /> : <View />}
                                <Image onError={this.onError} onLoadEnd={this.onLoadEnd} style={styles.image} source={source} />
                                {flashIcon ? <Image style={styles.orderImage} source={flashIcon} /> : <View />}
                            </View>
                        ) : null}
                        <View style={styles.left}>
                            <View style={styles.row}>
                                <View style={[styles.minYearsOld, { backgroundColor: minYearsOldBackgroundColor }]}>
                                    <Text.Caption style={styles.minYearsOldText}>
                                        {minYearsOld}
                                    </Text.Caption>
                                </View>
                                <Text.Title ellipsizeMode="tail" numberOfLines={1} style={[styles.title, light ? styles.titleLight : {}]}>{title}</Text.Title>
                            </View>
                            <Text.SubTitle style={[styles.body, light ? styles.bodyLight : {}]}>{body}</Text.SubTitle>
                            {date ? (
                                <View style={styles.date}>
                                    <Text.Caption style={styles.dateText}>{date}</Text.Caption>
                                </View>
                            ) : <View />}
                        </View>
                    </View>
                    {button ? <Button buttonStyle={styles.buttonStyle} size="medium" title={button} onPress={onPress} /> : <View />}
                    {rightIcon ? <Image source={rightIcon} style={styles.rightIcon} /> : null}
                </View>
            </TouchableOpacity>
        );
    }
}

FilmInfo.propTypes = {
    button: PropTypes.string,
    date: PropTypes.string,
    body: PropTypes.string,
    light: PropTypes.bool,
    minYearsOld: PropTypes.oneOf(['P', 'C13', 'C16', 'C18']),
    title: PropTypes.string,
    onPress: PropTypes.func,
    source: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
        uri: PropTypes.string
    })]),
    rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({
        uri: PropTypes.string
    })]),
    flashIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
};

FilmInfo.defaultProps = {
    light: false,
    flashIcon: IconSource.ic_order_film_gif
};
