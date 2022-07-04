import React, { Component } from 'react';
import {
    ViewPropTypes,
    findNodeHandle,
    UIManager
} from 'react-native';
import PropTypes from 'prop-types';
import { RCTCodeScannerConstants, RCTCodeScannerCommands, RCTCodeScannerView  } from '@momo-kits/core';

/** Define QRCodeScanner wrapper to native */
class QRCodeScanner extends Component {
    constructor(props) {
        super(props);
    }

    _setRef = (component) => {
        this._component = component;
    };

    readImageQRCode = (base64) => {
        const obj = findNodeHandle(this);
        const commandId = RCTCodeScannerCommands.readImageQRCode;
        if (obj != null && commandId != null) {
            UIManager.dispatchViewManagerCommand(
                obj,
                commandId,
                [base64],
            );
        }
    }

    startCamera = () => {
        const obj = findNodeHandle(this);
        const commandId = RCTCodeScannerCommands.startCamera;
        if (obj != null && commandId != null) {
            UIManager.dispatchViewManagerCommand(
                obj,
                commandId,
                [],
            );
        }
    }

    stopCamera = () => {
        const obj = findNodeHandle(this);
        const commandId = RCTCodeScannerCommands.stopCamera;
        if (obj != null && commandId != null) {
            UIManager.dispatchViewManagerCommand(
                obj,
                commandId,
                [],
            );
        }
    }

    setNativeProps = (props) => {
        const nativeProps = convertNativeProps(props);
        if (this._component) {
            this._component.setNativeProps(nativeProps);
        }
    }

    onBarCodeRead = ({ nativeEvent }) => {
        if (
            this._lastEvent
            && JSON.stringify(nativeEvent) === this._lastEvent
            && new Date() - this._lastEventTime < EventThrottleMs
        ) {
            return;
        }
        const { onBarCodeRead } = this.props;
        if (typeof onBarCodeRead === 'function') {
            onBarCodeRead(nativeEvent);
            this._lastEvent = JSON.stringify(nativeEvent);
            this._lastEventTime = new Date();
        }
    };

    onPressFlash = (torchMode) => {
        this.setNativeProps({
            torchMode
        });
    };

    render() {
        const { customFinder } = this.props;
        const nativeProps = convertNativeProps(this.props);
        return (
            <RCTCodeScannerView
                {...nativeProps}
                ref={this._setRef}
                onBarCodeRead={this.onBarCodeRead}
            >
                {customFinder && customFinder()}
            </RCTCodeScannerView>
        );
    }
}

const convertNativeProps = (props) => {
    const newProps = { ...props };
    if (typeof props.torchMode === 'string') {
        newProps.torchMode = QRCodeScannerConstants.TorchMode[props.torchMode];
    }
    if (typeof props.type === 'string') {
        newProps.type = QRCodeScannerConstants.Type[props.type];
    }
    return newProps;
};

QRCodeScanner.propTypes = {
    ...ViewPropTypes,
    onBarCodeRead: PropTypes.func,
    barCodeTypes: PropTypes.array,
    torchMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const QRCodeScannerConstants = {
    BarCodeType: RCTCodeScannerConstants.BarCodeType,
    Type: RCTCodeScannerConstants.Type,
    TorchMode: RCTCodeScannerConstants.TorchMode,
};

QRCodeScanner.defaultProps = {
    type: RCTCodeScannerConstants.Type.back,
    torchMode: RCTCodeScannerConstants.TorchMode.off,
    barCodeTypes: Object.values(RCTCodeScannerConstants.BarCodeType),
};

/** Define throttlems variables or constants */
const EventThrottleMs = 500;

export default QRCodeScanner;
