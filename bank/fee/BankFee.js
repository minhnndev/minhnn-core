import PropTypes, { any } from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, FlatList, Image, Keyboard
} from 'react-native';

import {
    Text, Colors, IconSource,Input,ValueUtil,TouchableOpacity,Spacing
} from '@momo-kits/core';
import Checkbox from "@momo-kits/check-box"
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingHorizontal: Spacing.L
    },
    titleContainer: {
        paddingVertical: 10
    },
    title: {
        color: Colors.black_14
    },
    leftText: {
        color: Colors.black_12,
    },
    rightText: {
        textAlign: 'right',
        color: Colors.black_17,
        flex: 1
    },
    list: {
        paddingVertical: 10
    },
    row: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row',
        paddingVertical: 3,
    },
    flexLeft: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    rowLeftText: {
        flexDirection: 'row',
        flex: 1
    },
    flexRight: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    check: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: Colors.text_color,
        backgroundColor: 'white',
        borderRadius: 3,
        marginRight: 5
    },
    icCheck: {
        tintColor: Colors.link,
        width: 14,
        height: 14
    },
    disableStyle: {
        opacity: 0.4
    },
    itemView: {
        paddingHorizontal: 0,
        paddingVertical: Spacing.XS
    },
    input: {
        marginBottom: 10,
        marginTop: 5
    },
    icon: {
        tintColor: Colors.text_color,
        width: 20,
        height: 20,
        marginLeft: Spacing.M
    },
    checkbox: {
        marginRight: Spacing.M
    }
});

export default class BankFee extends Component {
    constructor(props) {
        super(props);
        const valueMap = {};
        const check = props.initialCheck || {};
        const disableMap = props.initDisableMap || {};
        let maxEnableIndex = -1;
        Object.keys(check).forEach(k => {
            valueMap[k] = check[k].amount?.toString();
            maxEnableIndex = Math.max(maxEnableIndex, parseInt(k))
        })

        /**
         * set disable value
         */

        if (props.nestedFeeCheck) {
            props?.data?.forEach((item, index) => {
                if (index > maxEnableIndex + 1) {
                    disableMap[index] = true
                }
            })
        }

        this.state = {
            check,
            disableMap,
            valueMap
        };
        this.inputRef = {};

        this.previousCheckIndex = null;
    }

    onCheck = (item, index) => {
        const { check, valueMap, disableMap } = this.state;
        const { nestedFeeCheck = false, data, checkType } = this.props;

        let checkState = checkType === 'checkbox' ? check : {};
        let valueMapState = checkType === 'checkbox' ? valueMap : {}

        if (!checkState[index]) {
            checkState[index] = item;
            valueMapState[index] = (item.amount || 0).toString();
            if (nestedFeeCheck) {
                const newDisableMap = JSON.parse(JSON.stringify(disableMap));
                const nextIndex = Math.min(index + 1, Math.max((data || []).length - 1, 0));
                newDisableMap[nextIndex] = false;
                this.setState({ disableMap: newDisableMap });
            }
        } else {
            Keyboard.dismiss();
            if (this.inputRef[`input${index}`]) {
                this.inputRef[`input${index}`]?.onBlur();
            }

            delete checkState[index];
            delete valueMapState[index];
            if (nestedFeeCheck) {
                const newDisableMap = JSON.parse(JSON.stringify(disableMap));
                (data || []).forEach((i, ii) => {
                    if (ii > index) {
                        if (checkState[ii]) delete checkState[ii];
                        if (valueMapState[ii]) delete valueMapState[ii];
                        newDisableMap[ii] = true;
                    }
                });
                setTimeout(() => {
                    this.setState({ disableMap: newDisableMap });
                }, 200);
            }
        }

        /**
         * setimeout to prevent crashing from android device
         * cause of input field hide before keyboard closed
         * solution: close keyboard before 200ms input field hidden
         */
        setTimeout(() => {
            this.setState({ check: checkState, valueMap: valueMapState }, () => {
                const { onCheckChange } = this.props;
                if (onCheckChange && typeof onCheckChange === 'function') onCheckChange(checkState, index, valueMapState, item);
            });
        }, 200);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.disableMap && nextProps.disableMap !== prevState.disableMap) {
            return { disableMap: nextProps.disableMap };
        }
        return null;
    }

    setDisableMap = (disableMap) => {
        this.setState({ disableMap: JSON.parse(JSON.stringify(disableMap)) });
    }

    clearCheck = () => {
        const { data } = this.props;
        const { check } = this.state;
        const nextCheck = JSON.parse(JSON.stringify(check));
        if (Array.isArray(data)) {
            data.forEach((item, i) => {
                nextCheck[i] = false;
            });
        }
        this.setState({ check: nextCheck, valueMap: {} }, () => {
            const { onCheckChange } = this.props;
            if (onCheckChange && typeof onCheckChange === 'function') {
                onCheckChange({}, undefined, {});
            }
        });
    }

    onChangeText = (value, index, item) => {
        const { onChangeText } = this.props;
        const { valueMap } = this.state;
        valueMap[index] = value;
        this.setState({ valueMap });
        if (onChangeText && typeof onChangeText === 'function') onChangeText(value, index, valueMap, item);
    }

    onRightIconPress = (item) => {
        const { onRightIconPress } = this.props;
        if (onRightIconPress && typeof onRightIconPress === 'function') onRightIconPress(item);
    }

    onLeftIconPress = (item) => {
        const { onLeftIconPress } = this.props;
        if (onLeftIconPress && typeof onLeftIconPress === 'function') onLeftIconPress(item);
    }

    renderRightTextComponent = (item, rightText, rightStyle) => {
        if (typeof item?.onRightPress === 'function') {
            return <TouchableOpacity onPress={item?.onRightPress}>
                <Text.Title style={[styles.rightText, item?.rightStyle, ValueUtil.extractStyle(rightStyle)]}>{rightText}</Text.Title>
            </TouchableOpacity>
        }
        return <Text.Title style={[styles.rightText, item?.rightStyle, ValueUtil.extractStyle(rightStyle)]}>{rightText}</Text.Title>
    }

    renderItem = ({ item, index }) => {
        const {
            leftStyle, rightStyle, leftCheck, leftContainerStyle, rightContainerStyle, inputOverAmountError,
            showInputOnCheck, inputProps, maxValue, inputOverMaxValueError, minValue, inputLowerMinValueError,
            inputInvalidError, itemContainerStyle, inputEmptyError,
            rightIconStyle, autoAlignItem = false, maxAlignRate = 1.5, getItemStyle = () => { }, checkType,
            leftIconStyle, disableStyle = {}
        } = this.props;
        const { check, disableMap, valueMap } = this.state;
        const onItemPress = () => this.onCheck(item, index);
        const onChangeText = (value) => this.onChangeText(value, index, item);
        const onRightIconPress = () => this.onRightIconPress(item);
        const onLeftIconPress = () => this.onLeftIconPress(item)
        const inputValue = valueMap[index] || '';
        const disable = disableMap && disableMap[index] || item.disableCheck;
        const disableCheckChange = item.disableCheckChange || false;
        const itemLeftCheck = leftCheck || item.leftCheck;
        const errorMessageWhenMax = parseInt(inputValue) > maxValue ? inputOverMaxValueError : false;
        const errorMessageWhenMin = parseInt(inputValue) < minValue ? inputLowerMinValueError : false;
        const errorMessageWhenInputInvalid = parseInt(inputValue) % 1000 !== 0 && parseInt(inputValue) > minValue ? inputInvalidError : false;
        const errorMessageWhenEmpty = inputValue?.length === 0 ? inputEmptyError : false;
        const errorMessageWhenInputOverAmount = parseInt(inputValue) > item.amount ? inputOverAmountError : false;
        const leftText = item.left || item.title || '';
        const rightText = item.right || item.value || '';
        let autoAlignLeft = { flex: 1 };
        let autoAlignRight = { flex: 1 }
        if (autoAlignItem) {
            const leftTextLength = leftText.length;
            const rightTextLength = rightText.length;
            autoAlignLeft = { flex: Math.max(1, Math.min(maxAlignRate, Math.floor(leftTextLength / rightTextLength))) }
            autoAlignRight = { flex: Math.max(1, Math.min(maxAlignRate, Math.floor(rightTextLength / leftTextLength))) }
        }

        const customDisableStyle = [styles.disableStyle, disableStyle];

        const ItemView = (
            <View style={[styles.itemView, itemContainerStyle, getItemStyle(item, index)]}>
                <View style={styles.row}>
                    <View style={[styles.flexLeft, autoAlignLeft, ValueUtil.extractStyle(leftContainerStyle)]}>
                        {itemLeftCheck ? <Checkbox
                            testID={leftText?.replace(/ /g, '')}
                            accessibilityLabel={leftText?.replace(/ /g, '')}
                            checkType={checkType}
                            style={styles.checkbox}
                            canCheckChange={!disableCheckChange}
                            onChange={onItemPress}
                            disabled={disable}
                            value={check[index] !== undefined} /> : <View />}
                        <View style={styles.rowLeftText}>
                            <Text.Title style={[styles.leftText, item?.leftStyle, ValueUtil.extractStyle(leftStyle), disable ? customDisableStyle : {}]}>{leftText}</Text.Title>
                            {item?.leftIcon ? (
                                <TouchableOpacity onPress={onLeftIconPress} activeOpacity={0.5}>
                                    <Image
                                        source={ValueUtil.getImageSource(item?.leftIcon)}
                                        style={[styles.icon, { tintColor: item.leftIconColor }, ValueUtil.extractStyle(leftIconStyle)]}
                                    />
                                </TouchableOpacity>
                            ) : <View />}
                        </View>
                    </View>
                    <View style={{ flex: 0.1 }} />
                    <View style={[styles.flexRight, autoAlignRight, ValueUtil.extractStyle(rightContainerStyle)]}>
                        {this.renderRightTextComponent(item, rightText, rightStyle)}
                        {item?.rightIcon ? (
                            <TouchableOpacity onPress={onRightIconPress} activeOpacity={0.5}>
                                <Image
                                    source={ValueUtil.getImageSource(item?.rightIcon)}
                                    style={[styles.icon, { tintColor: item.rightIconColor }, ValueUtil.extractStyle(rightIconStyle)]}
                                />
                            </TouchableOpacity>
                        ) : <View />}
                    </View>
                </View>
                {check[index] && showInputOnCheck ? (
                    <Input.Underline
                        clearOnRightPress
                        rightIcon={IconSource.ic_close_circle_full}
                        inputType="money"
                        keyboardType="numeric"
                        style={styles.input}
                        onChangeText={onChangeText}
                        value={inputValue?.toString?.()}
                        rightIconStyle={{ tintColor: Colors.black_17 }}
                        errorMessage={errorMessageWhenEmpty || errorMessageWhenMax || errorMessageWhenMin || errorMessageWhenInputInvalid || errorMessageWhenInputOverAmount}
                        {...inputProps}
                        ref={(ref) => this.inputRef = { ...this.inputRef, [`input${index}`]: ref }}
                    />
                ) : <View />}
            </View>

        );
        return ItemView;
    }

    renderDefaultHeader = () => {
        const { title, headerContainerStyle, titleStyle } = this.props;
        if (!title) return <View />;
        return (
            <View style={[styles.titleContainer, ValueUtil.extractStyle(headerContainerStyle)]}>
                <Text.H4 weight="medium" style={[styles.title, ValueUtil.extractStyle(titleStyle)]}>{title}</Text.H4>
            </View>
        );
    }

    renderListHeaderComponent = () => {
        const { headerItem, ListHeaderComponent } = this.props;
        if (headerItem) {
            return this.renderItem({ item: { ...headerItem, isHeader: true }, index: -1 })
        }
        if (ListHeaderComponent) {
            return ListHeaderComponent
        }
        return null
    }

    render() {
        const {
            style, data, headerComponent, listProps = {}
        } = this.props;
        if (!Array.isArray(data)) return <View />;

        return (
            <View style={[styles.container, ValueUtil.extractStyle(style)]}>
                {headerComponent || this.renderDefaultHeader()}
                <FlatList
                    data={data}
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={false}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={this.renderListHeaderComponent}
                    {...listProps}
                />
            </View>
        );
    }
}

BankFee.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            left: PropTypes.string,
            right: PropTypes.string
        })
    ).isRequired,
    disableMap: PropTypes.object,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    listProps: PropTypes.object,
    leftContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rightContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rightStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    leftStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    title: PropTypes.string,
    onCheckChange: PropTypes.func,
    leftCheck: PropTypes.bool,
    headerComponent: any,
    showInputOnCheck: PropTypes.bool,
    inputProps: PropTypes.any,
    onChangeText: PropTypes.func,
    maxValue: PropTypes.number,
    inputOverMaxValueError: PropTypes.string,
    minValue: PropTypes.number,
    inputLowerMinValueError: PropTypes.string,
    inputInvalidError: PropTypes.string,
    inputOverAmountError: PropTypes.string,
    initialCheck: PropTypes.object,
    onRightIconPress: PropTypes.func,
    itemContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    headerContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    disableStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    autoAlignItem: PropTypes.bool,
    maxAlignRate: PropTypes.number,
    checkType: PropTypes.oneOf(['checkbox', 'radio'])
};


BankFee.defaultProps = {
    checkType: 'checkbox'
}