import React, { useLayoutEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { hooks, utils } from '../assets';
import StackNavigator from '../navigator/StackNavigator';
import { requestFunction } from '../../../utils/PlatformUtils';
import HeaderRight from '../components/AnimatedHeaderRight';

const ScreenStack = ({ route, navigation, ...props }) => {
    const {
        params, navigator, ScreenComp
    } = hooks.useNavigator({
        StackClass: StackNavigator, route, navigation, ...props
    });

    useLayoutEffect(() => {
        requestFunction('getToolkit', [null], null, (result) => {
            if (result === true) {
                navigator?.setOptions?.({
                    headerRight: () => (
                        <HeaderRight
                            onAction={() => requestFunction('showToolkit', [])}
                            onClose={() => requestFunction('dismiss', [])}
                        />
                    )
                });
            }
        });
    }, []);

    const insets = useSafeArea();

    const headerHeight = utils.getDefaultHeaderHeight() + insets.top;

    return <ScreenComp params={params} navigator={navigator} headerHeight={headerHeight} />;
};

export default ScreenStack;
