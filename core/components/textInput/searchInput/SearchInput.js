import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { isEmpty } from 'lodash';
import TypeWriter from 'react-native-typewriter';
import Colors from '../../../colors';
import Text from '../../typography';
import SwitchLanguage from '../../language/SwitchLanguage';
import FastImage from '../../image/FastImage';

const IC_SEARCH =
    'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/24_navigation_search.png';
const IC_CLOSE =
    'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/16_navigation_close_circle_full.png';

const styles = StyleSheet.create({
    content: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    line: {
        marginHorizontal: 8,
        height: 20,
        width: 1,
        backgroundColor: Colors.border_color_gray,
    },
    container: {
        flex: 1,
        borderRadius: 18,
        height: 36,
        backgroundColor: Colors.search_background_color,
        paddingHorizontal: 12,
        paddingVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.black_04,
        borderWidth: 0.5,
    },
    view: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 6,
        resizeMode: 'contain',
    },
    iconRight: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    cancel: {
        width: 16,
        height: 16,
        marginLeft: 6,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: Colors.second_text_color,
        minHeight: 30,
        // height: 36,
        padding: 0,
    },
    btnInput: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 30,
        // height: 36,
        padding: 0,
    },
    txtInput: {
        fontSize: 14,
        color: Colors.second_text_color,
    },
    btnClose: { marginLeft: 16 },
    txtClose: { color: 'white' },
    highlight: {
        borderWidth: 0.5,
        borderColor: Colors.pink_05,
    },
    typeWriter: {
        opacity: 0.6,
    },
});

export default class SearchInput extends Component {
    static valueDefault = '';

    constructor(props) {
        super(props);
        SearchInput.valueDefault = props.defaultValue || props.value || '';
        this.state = {
            value: props.defaultValue || props.value || '',
            ownUpdate: false,
            focused: false,
            typeMode: true,
            keyword: props?.keywords?.[0] || '',
            keywordIndex: 0,
        };
        this.timeout;
    }

    componentDidMount() {
        // this.setTypeMode();
    }

    componentWillUnmount() {}

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.ownUpdate) {
            return {
                ownUpdate: false,
            };
        }
        if (
            !!nextProps.value &&
            nextProps.value !== prevState.value &&
            SearchInput.valueDefault !== nextProps.value
        ) {
            SearchInput.valueDefault = nextProps.value;
            return { value: nextProps.value };
        }
        return null;
    }

    setText = (text) => {
        if (typeof text === 'string') {
            this.onChangeText(text);
        } else if (typeof text === 'number') {
            this.onChangeText(text.toString());
        } else {
            console.warn('text value should be string or number', typeof text);
        }
    };

    onChangeText = (text) => {
        this.setState({ value: text, ownUpdate: true });
        const { onChangeText, debound } = this.props;
        if (onChangeText && typeof onChangeText === 'function') {
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                onChangeText(text);
            }, debound);
        }
    };

    onPress = () => {
        this.setState({ value: '', ownUpdate: true }, () => {
            const { onPressCancel, onChangeText } = this.props;
            if (onPressCancel && typeof onPressCancel === 'function') {
                onPressCancel();
            }
            if (onChangeText && typeof onChangeText === 'function')
                onChangeText('');
        });
    };

    focus = () => {
        if (this.inputRef) {
            this.inputRef.focus();
        }
    };

    onFocus = () => {
        this.setState({ focused: true }, () => {
            const { onFocus, typeWriterMode } = this.props;
            if (typeWriterMode) this.setState({ value: this.state.keyword });
            if (onFocus && typeof onFocus === 'function') onFocus();
        });
    };

    onBlur = () => {
        this.setState({ focused: false }, () => {
            const { onBlur } = this.props;
            if (onBlur && typeof onBlur === 'function') onBlur();
        });
    };

    sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    wait = (ms) => {
        var start = Date.now(),
            now = start;
        while (now - start < ms) {
            now = Date.now();
        }
    };

    onTypeWriterEnd = async (keywords) => {
        const { keywordIndex } = this.state;
        const typeMode = !this.state.typeMode;
        let index = keywordIndex;

        if (typeMode === false) {
            this.wait(2000);
        }

        if (typeMode === false) {
            index += 1;
            if (index > keywords.length - 1) index = 0;
            this.setState({ keywordIndex: index });
        }

        if (typeMode === true) {
            this.setState({
                keyword: keywords[keywordIndex],
            });
        }

        this.setState({ typeMode });
    };

    render() {
        const {
            onPress,
            placeholder,
            containerStyle,
            style,
            textStyle,
            iconRightStyle,
            iconRight,
            onPressIconRight,
            cancelStyle,
            textCancel,
            onCancel,
            isHighlight,
            textCancelStyle,
            typeWriterMode,
            keywords = [],
            typeWriterStyle,
        } = this.props;
        const { value, focused } = this.state;
        const isFunction = onPress && typeof onPress === 'function';
        return (
            <View style={[styles.content, containerStyle]}>
                <TouchableOpacity
                    activeOpacity={0.97}
                    disabled={!isFunction}
                    onPress={onPress}
                    style={[
                        styles.container,
                        style,
                        isHighlight && focused && styles.highlight,
                    ]}
                    accessible={false}>
                    <View style={styles.view}>
                        <FastImage
                            style={styles.icon}
                            source={IC_SEARCH}
                            tintColor={Colors.black_09}
                        />
                        {isFunction ? (
                            <View style={[styles.btnInput, textStyle]}>
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.txtInput,
                                        isEmpty(value) && {
                                            color: Colors.second_text_color,
                                        },
                                    ]}>
                                    {value || placeholder}
                                </Text>
                            </View>
                        ) : (
                            <TextInput
                                allowFontScaling={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoFocus={false}
                                {...this.props}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                                value={value}
                                onChangeText={this.onChangeText}
                                underlineColorAndroid="transparent"
                                style={[styles.input, textStyle]}
                                ref={(ref) => (this.inputRef = ref)}
                                accessibilityLabel={`${
                                    placeholder || ''
                                }/TextInput`}>
                                {!focused && typeWriterMode && (
                                    <TypeWriter
                                        typing={this.state.typeMode ? 1 : -1}
                                        onTypingEnd={() =>
                                            this.onTypeWriterEnd(keywords)
                                        }
                                        minDelay={45}
                                        style={[
                                            styles.typeWriter,
                                            typeWriterStyle,
                                        ]}>
                                        {this.state.keyword + ' '}
                                    </TypeWriter>
                                )}
                            </TextInput>
                        )}
                        {value.length ? (
                            <TouchableOpacity onPress={this.onPress}>
                                <FastImage
                                    style={styles.cancel}
                                    source={IC_CLOSE}
                                    tintColor={Colors.black_17}
                                />
                            </TouchableOpacity>
                        ) : (
                            <View />
                        )}
                        {iconRight && (
                            <TouchableOpacity
                                onPress={onPressIconRight}
                                style={styles.viewRight}>
                                <View style={styles.line} />
                                <FastImage
                                    style={[styles.iconRight, iconRightStyle]}
                                    source={iconRight}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
                {onCancel && (
                    <TouchableOpacity
                        style={[styles.btnClose, cancelStyle]}
                        onPress={onCancel}>
                        <Text.H4 style={[styles.txtClose, textCancelStyle]}>
                            {textCancel || SwitchLanguage.cancel}
                        </Text.H4>
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

SearchInput.propTypes = {
    cancelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    textCancelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    textCancel: PropTypes.string,
    onCancel: PropTypes.func,
    isHighlight: PropTypes.bool,
    onPressCancel: PropTypes.any,
    style: PropTypes.any,
    textStyle: PropTypes.any,
    debound: PropTypes.number,
    onPressIconRight: PropTypes.func,
    iconRightStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    iconRight: PropTypes.any,
    typeWriterMode: PropTypes.bool,
    keywords: PropTypes.array,
    typeWriterStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

SearchInput.defaultProps = {
    debound: 100,
};
