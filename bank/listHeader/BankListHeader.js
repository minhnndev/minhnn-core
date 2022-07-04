import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, TouchableOpacity
} from 'react-native';
import {
    Text, Colors, IconSource, Image
} from '@momo-kits/core';

const styles = StyleSheet.create({
    container: {

    },
    textTitle: {
        color: Colors.black_14
    },
    textSubTitle: {
        color: Colors.black_12,
    },
    label: {
        color: 'white',
        paddingHorizontal: 8,
        paddingVertical: 1,
        lineHeight: 12
    },
    labelContainer: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        marginRight: 5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    question: {
        width: 16,
        height: 16,
        marginLeft: 5
    },
    secondRow: {
        marginTop: 2
    }
});

export default class BankListHeader extends Component {
    renderHeader = () => {
        const {
            title, subTitle, label, hideQuestionIcon, style
        } = this.props;
        return (
            <View style={[styles.container, style]}>
                <View style={styles.row}>
                    <Text.H4 weight="medium" style={styles.textTitle}>{title}</Text.H4>
                    {!hideQuestionIcon ? (
                        <Image source={IconSource.ic_notification_info} style={styles.question} />
                    ) : <View />}
                </View>
                <View style={[styles.row, styles.secondRow]}>
                    {label ? (
                        <View style={styles.labelContainer}>
                            <Text.Caption style={styles.label}>{label}</Text.Caption>
                        </View>
                    ) : <View />}
                    {subTitle ? <Text.SubTitle style={styles.textSubTitle}>{subTitle}</Text.SubTitle> : <View />}
                </View>
            </View>
        );
    }

    render() {
        const { onHeaderPress } = this.props;
        if (onHeaderPress && typeof onHeaderPress === 'function') {
            return (
                <TouchableOpacity onPress={onHeaderPress} activeOpacity={0.5}>
                    {this.renderHeader()}
                </TouchableOpacity>
            );
        }
        return this.renderHeader();
    }
}

BankListHeader.propTypes = {
    hideQuestionIcon: PropTypes.bool,
    label: PropTypes.string,
    onHeaderPress: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    subTitle: PropTypes.string,
    title: PropTypes.string
};
