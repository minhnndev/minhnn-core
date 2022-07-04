/* eslint-disable react/display-name */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/destructuring-assignment */
import React, {
    useState, forwardRef, useEffect, memo
} from 'react';
import { isEmpty } from 'lodash';
import {
    ResourceManager, Colors, Image, LottieView, WebView
} from '@momo-kits/core';

import {
    isUrl, useCacheResouce, getCacheJsonExistedInApp, getUrl
} from './utils';

ResourceManager.loadResource('lottie');

const Lottie = memo(forwardRef((props, ref) => {
    if (props.webMode) {
        return !isEmpty(props.source)
            ? (
                <WebView
                    scrollEnabled={false}
                    style={[
                        {
                            backgroundColor: Colors.transparent,
                        },
                        props.style,
                    ]}
                    javaScriptEnabled
                    originWhitelist={['https://*', 'git://*']}
                    source={{
                        html: `<html>
<head>
  <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
  <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">
</head>
<body>
  <lottie-player src="${props.source}" background="transparent" speed="${props?.speed || 1}"
     style="width: 100%; height: 100%;" loop="${props?.loop || false}" autoplay="${props?.autoPlay || false}"></lottie-player>
</body>
</html>`,
                    }}
                />
            )
            : null;
    }

    const [source, setSource] = useState(isUrl(getUrl(props?.source)) ? '' : getUrl(props?.source));

    useEffect(() => {
        const fectchJson = async () => {
            let json = null;
            try {
                const response = await fetch(getUrl(props.source));
                if (response.ok) {
                    json = await response.json();
                }
            } catch (e) {
                console.log('ERROR SVG', e);
            } finally {
                setSource(json);
                const { saveResource = {} } = useCacheResouce();
                ResourceManager.setResource({ ...saveResource, ...{ [props.source]: { value: json, createTime: new Date().getTime() } } }, ResourceManager.LOTTIE);
            }
        };

        if (isUrl(getUrl(props.source))) {
            const cached = getCacheJsonExistedInApp(props.source);
            if (cached) {
                setSource(cached);
            } else {
                fectchJson();
            }
        } else {
            setSource(getUrl(props.source));
        }
    }, [props.source]);

    if (isEmpty(source)) return null;

    if (props.isLowPerformance && props.defaultSource) {
        return (
            <Image
                {...props}
                ref={ref}
                source={props.defaultSource}
            />
        );
    }

    return (
        <LottieView
            {...props}
            ref={ref}
            source={source}
        />
    );
}));

Lottie.preload = async (data) => {
    if (isEmpty(data)) return console.warn('Lottie: Input is undefined');
    const resourceLotties = {};
    const { cacheResource = {}, currentResouce = {}, saveResource = {} } = useCacheResouce();
    const fectchJson = async (url) => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const json = await response.json();
                return json;
            }
        } catch (e) {
            console.log('ERROR SVG', e);
        }
    };
    for (let i = 0; i < data.length; i++) {
        if (currentResouce?.[data[i]]?.value || cacheResource?.[data[i]]?.value) {
            continue;
        } else {
            const json = await fectchJson(data[i]);
            resourceLotties[data[i]] = { value: json, createTime: new Date().getTime() };
        }
    }
    if (!isEmpty(resourceLotties)) {
        ResourceManager.setResource({ ...saveResource, ...resourceLotties }, ResourceManager.LOTTIE);
    }
};

export default Lottie;
