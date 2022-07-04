/* eslint-disable no-template-curly-in-string */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, Animated, Easing, StyleSheet, Dimensions, TouchableOpacity
} from 'react-native';

import {
    Text, Colors, SwitchLanguage
} from '@momo-kits/core';
import Shortcut from '@momo-kits/shortcut';
import BankListHeader from '../listHeader/BankListHeader';

const { width: screenWidth } = Dimensions.get('window');
const PADDING = 0;
const ITEM_WIDTH = (screenWidth - PADDING) / 4;
const ICON_SIZE = 42;
const ROW_HEIGHT = ICON_SIZE + 8 + 40; // 40 icon, 8 padding border, 40 2 lines text

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: PADDING,
        paddingTop: 15
    },
    row: {
        height: ROW_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center'
    },
    flex: {
        flex: 1
    },
    itemStyle: {
        width: ITEM_WIDTH,
        height: ROW_HEIGHT,
        justifyContent: 'flex-start',
    },
    iconContainerStyle: {
        borderRadius: 5,
        width: 45,
        height: 45,
        borderColor: Colors.black_04,
        borderWidth: 1
    },
    displayMore: {
        borderTopColor: Colors.borders,
        borderTopWidth: 1,
        borderBottomColor: Colors.borders,
        borderBottomWidth: 1,
        marginTop: 12,
    },
    displayMoreText: {
        color: Colors.brown_grey_three,
        paddingVertical: 5,
        textAlign: 'center'
    },
    disableStyle: {
        opacity: 0.4
    },
    header: {
        marginBottom: 5,
        marginHorizontal: 20
    },
    containerContent: { marginTop: 10 },
    customHeader: { marginHorizontal: 20 },
    textStyle: {
        width: ITEM_WIDTH - 5,
        textAlign: 'center',
        fontSize: 11,
        lineHeight: 14
    }
});

export default class BankList extends Component {
    constructor(props) {
        super(props);
        this.animatedHeight = new Animated.Value(props.displayAll ? 1 : 0);
        this.state = {
            expanded: props.displayAll || false,
        };
    }

    renderItem = (item, index) => {
        const { itemProps, disabled, disableItems = [], compareKey = 'id' } = this.props;
        const containerSize = { width: ICON_SIZE, height: ICON_SIZE };
        const containerWidth = containerSize.width + 8;
        const containerStyle = { borderRadius: 5, width: containerWidth, height: containerWidth };
        let config = {};
        let bankName = item.name;
        const diableItem = disableItems ? disableItems?.find(it => it?.[compareKey] === item?.[compareKey]) : null;

        if (item?.config) {
            try {
                config = JSON.parse(item.config);
                bankName = SwitchLanguage.getLocalize(config?.options?.title);
            } catch (e) {
                // bankName = ;
            }
        }

        return (
            <Shortcut
                key={index.toString()}
                customSize={containerSize}
                style={styles.itemStyle}
                titleStyle={[styles.textStyle, !!diableItem && {opacity: 0.3}]}
                iconStyle={!!diableItem && {opacity: 0.3}}
                iconContainerStyle={[styles.iconContainerStyle, containerStyle]}
                source={item.icon}
                {...itemProps}
                title={bankName}
                onPress={disabled ? null : () => this.onPress(item)}
            />
        );
    }

    onPress = (item) => {
        const { onPress } = this.props;
        if (onPress && typeof onPress === 'function') onPress(item);
    }

    renderFooterComponent = () => {
        const {
            data, disabled, displayAll, canExpandWhenDisable, forceShowExpandButton, minimumRow, numColumns
        } = this.props;
        if (displayAll && !forceShowExpandButton) return <View />;
        let otherItemCount = 0;
        const renderItemLength = (minimumRow * numColumns);
        if (Array.isArray(data)) otherItemCount = data.length > renderItemLength ? data.length - renderItemLength : 0;
        if (otherItemCount === 0) return <View />;
        const { expanded } = this.state;
        const displayValue = !expanded ? SwitchLanguage?.viewMoreBank?.replace('${otherItemCount}', otherItemCount) : SwitchLanguage?.SHORTEN;
        return (
            <TouchableOpacity activeOpacity={disabled && !canExpandWhenDisable ? 1 : 0.5} onPress={disabled && !canExpandWhenDisable ? null : this.onPressExpend}>
                <View style={styles.displayMore}>
                    <Text.Title style={[styles.displayMoreText]}>
                        {displayValue}
                    </Text.Title>
                </View>
            </TouchableOpacity>
        );
    }

    onPressExpend = () => {
        const { expanded } = this.state;
        Animated.timing(this.animatedHeight, {
            toValue: expanded ? 0 : 1,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => {
            this.setState({ expanded: !expanded });
        });
    }

    renderContent = () => {
        const { data, numColumns, minimumRow } = this.props;
        const { expanded } = this.state;
        if (!Array.isArray(data)) return <View />;
        const bankListRow = [];
        let row = [];
        data.forEach((item, index) => {
            if (!expanded && bankListRow.length === minimumRow) return;
            if (row.length < numColumns - 1) {
                row.push(this.renderItem(item, index));
            } else {
                row.push(this.renderItem(item, index));
                bankListRow.push(
                    <View key={bankListRow.length.toString()} style={styles.row}>
                        {row}
                    </View>
                );
                row = [];
            }
        });
        if (row.length > 0) {
            bankListRow.push(
                <View key={(bankListRow.length + 1).toString()} style={styles.row}>
                    {row}
                </View>
            );
        }
        return bankListRow;
    }

    render() {
        const {
            style, data, numColumns, disabled, title, subTitle, label,
            onHeaderPress, hideHeader, hideQuestionIcon, renderCustomHeader,
            minimumRow
        } = this.props;
        if (!Array.isArray(data)) return <View />;
        const minHeight = (data.length > numColumns ? minimumRow : 1) * ROW_HEIGHT;
        const maxHeight = (((data.length % numColumns) === 0 ? 0 : 1) + Math.floor(data.length / numColumns)) * ROW_HEIGHT;

        const height = this.animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [minHeight, maxHeight],
            extrapolate: 'clamp',
        });

        return (
            <View style={[styles.container, style]}>
                {hideHeader ? <View /> : (
                    <BankListHeader
                        style={styles.header}
                        title={title}
                        label={label}
                        subTitle={subTitle}
                        hideQuestionIcon={hideQuestionIcon}
                        onHeaderPress={onHeaderPress}
                    />
                )}
                <View style={styles.customHeader}>
                    {renderCustomHeader?.()}
                </View>
                <View style={disabled ? styles.disableStyle : {}}>
                    <Animated.View style={[styles.containerContent, { height }]}>
                        {this.renderContent()}
                    </Animated.View>
                    {this.renderFooterComponent()}
                </View>
            </View>
        );
    }
}

BankList.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number])
        })
    ).isRequired,
    onPress: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    numColumns: PropTypes.number,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    label: PropTypes.string,
    onHeaderPress: PropTypes.func,
    displayAll: PropTypes.bool,
    hideHeader: PropTypes.bool,
    canExpandWhenDisable: PropTypes.bool,
    renderCustomHeader: PropTypes.func,
    itemProps: PropTypes.object,
    forceShowExpandButton: PropTypes.bool,
    minimumRow: PropTypes.number,
    disableItems: PropTypes.array,
    compareKey: PropTypes.string
};

BankList.defaultProps = {
    numColumns: 4,
    disabled: false,
    displayAll: false,
    hideHeader: false,
    itemProps: {},
    forceShowExpandButton: false,
    minimumRow: 2
};
