import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '@momo-kits/core';
import BankFee from '../fee/BankFee';

const ARROW_UP_ICON = 'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/24_arrow_chevron_up.png';
const ARROW_DOWN_ICON = 'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/24_arrow_chevron_down.png';

const styles = StyleSheet.create({
    container: { paddingHorizontal: Spacing.L },
    contentContainerStyle: {
        borderColor: Colors.black_04,
        borderRadius: 12,
        borderWidth: 1
    },
    itemContainerStyle: {
        paddingHorizontal: Spacing.M,
        paddingVertical: Spacing.M,
        justifyContent: 'center',
    },
    line: {
        backgroundColor: Colors.black_04,
        height: 1,
        marginHorizontal: Spacing.M
    },
    rightStyle: {
        color: Colors.black_17,
        fontWeight: 'bold'
    },
    headerContainerStyle: {
        height: 48,
        justifyContent: 'center',
        paddingVertical: 0,
        marginBottom: Spacing.XS
    }
});

export default class InforTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showData: !props.headerItem,
        };
    }

    renderItemSeparator = () => <View style={styles.line} />

    onRightIconPress = (item) => {
        if (item.isHeader) {
            const { showData } = this.state;
            this.setState({ showData: !showData });
        } else {
            const { onRightIconPress } = this.props;
            onRightIconPress?.(item);
        }
    }

    render() {
        const { listProps, headerItem, data } = this.props;
        const { showData } = this.state;
        listProps.ItemSeparatorComponent = this.renderItemSeparator;
        if (headerItem) {
            headerItem.rightIcon = showData ? ARROW_UP_ICON : ARROW_DOWN_ICON;
            headerItem.rightIconColor = Colors.blue_04;
            headerItem.leftCheck = true;
        }

        return (
            <BankFee
                listProps={listProps}
                itemContainerStyle={styles.itemContainerStyle}
                style={styles.container}
                rightStyle={styles.rightStyle}
                headerItem={headerItem}
                getItemStyle={(item, index) => {
                    if (index >= 0 && headerItem) return { backgroundColor: Colors.black_02, };
                }}
                {...this.props}
                headerContainerStyle={styles.headerContainerStyle}
                onRightIconPress={this.onRightIconPress}
                data={showData ? data : []}
            />
        );
    }
}

InforTable.propTypes = {
    data: PropTypes.any,
    listProps: PropTypes.object,
    itemContainerStyle: PropTypes.object,
    headerItem: PropTypes.object
};

InforTable.defaultProps = {
    listProps: {
        contentContainerStyle: styles.contentContainerStyle,
    }
};
