import { isEmpty } from 'lodash';
import {
    ResourceManager
} from '@momo-kits/core';

export const isUrl = (source) => typeof source === 'string' && source?.startsWith('http');

export const useCacheResouce = () => {
    const cacheResource = ResourceManager.getCacheResource(ResourceManager.LOTTIE) || {};
    const currentResouce = ResourceManager?.resource?.lottie || {};
    const saveResource = isEmpty(currentResouce) ? cacheResource : currentResouce;
    return { cacheResource, currentResouce, saveResource };
};

export const getCacheJsonExistedInApp = (key) => {
    const { cacheResource = {}, currentResouce = {} } = useCacheResouce();
    return currentResouce?.[key]?.value || cacheResource?.[key]?.value;
};

export const calculateTime = (time) => {
    const miniSecondOfOneDay = 86400000;
    const timeCache = miniSecondOfOneDay * 7;
    const avgDate = Math.round((time) / timeCache);
    return avgDate;
};

export const getUrl = (source) => {
    let url = source;
    if (typeof source?.uri === 'string' && source?.uri?.startsWith('http')) {
        url = source?.uri;
    }
    return url;
};
