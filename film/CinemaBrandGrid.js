import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import CinemaBrand from './CinemaBrand';

const styles = StyleSheet.create({
    contentContainerStyle: { marginHorizontal: 16 }
});

export default class CinemaBrandGrid extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: props.initialIndex
        };
    }

    onPress = (item, index) => {
        this.setState({ selectedIndex: index });
        const { onItemPress } = this.props;
        if (typeof onItemPress === 'function') onItemPress(item, index);
    }

    onItemProps = (item) => {
        const { onItemProps } = this.props;
        if (typeof onItemProps === 'function' && typeof onItemProps(item) === 'object') {
            return onItemProps(item);
        }
        return {};
    }

    renderItem = ({ item, index }) => {
        const { selectedIndex } = this.state;
        const { numColumns, itemStyle, itemProps } = this.props;
        const onPress = () => this.onPress(item, index);
        const customItemProps = this.onItemProps(item);
        let marginLeft = 0;
        if (index % numColumns !== 0) {
            marginLeft = 16;
        }
        const customStyle = { marginLeft };
        return (
            <CinemaBrand
                onPress={onPress}
                selected={index === selectedIndex}
                style={[itemStyle, customStyle]}
                numColumns={numColumns}
                {...customItemProps}
                {...itemProps}

            />
        );
    }

    render() {
        const { numColumns } = this.props;
        return (
            <FlatList
                numColumns={numColumns}
                renderItem={this.renderItem}
                contentContainerStyle={styles.contentContainerStyle}
                keyExtractor={(i, ii) => ii.toString()}
                {...this.props}
            />

        );
    }
}

CinemaBrandGrid.propTypes = {
    initialIndex: PropTypes.number,
    itemProps: PropTypes.object,
    itemStyle: PropTypes.any,
    numColumns: PropTypes.number,
    onItemProps: PropTypes.func,
    onItemPress: PropTypes.func
};

CinemaBrandGrid.defaultProps = {
    itemProps: {},
    numColumns: 5
};
