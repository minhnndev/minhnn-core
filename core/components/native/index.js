import { requireNativeComponent, ViewPropTypes, UIManager } from 'react-native';
import PropTypes from 'prop-types';

const RCTBarCodeProps = {
    name: 'RCTBarCode',
    propTypes: {
        code: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        ratio: PropTypes.number,
        ...ViewPropTypes,
    },
};

const QRCodeViewProps = {
    name: 'QRCodeView',
    propTypes: {
        code: PropTypes.string,
        size: PropTypes.number,
        ratio: PropTypes.number,
        showLogo: PropTypes.bool,
        ...ViewPropTypes,
    },
};

export const RCTCodeScannerConfig = UIManager.getViewManagerConfig('RCTCodeScanner');
export const RCTCodeScannerConstants = RCTCodeScannerConfig.Constants;
export const RCTCodeScannerCommands = RCTCodeScannerConfig.Commands;
export const RCTCodeScannerView = requireNativeComponent('RCTCodeScanner');
export const MomoTextInputCalculator = requireNativeComponent('MomoTextInputCalculator');

export const RCTQRCode = requireNativeComponent('RCTQRCode', QRCodeViewProps);
export const RCTBarCode = requireNativeComponent('RCTBarCode', RCTBarCodeProps);
