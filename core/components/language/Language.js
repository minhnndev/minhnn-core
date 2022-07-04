/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-classes-per-file */
import { isEmpty } from 'lodash';
import { NativeModules } from 'react-native';
import ResourceManager from '../../resources/ResourceManager';
import Observer from '../../observer/Observer';
import StringChecker from './StringChecker';
import ValueUtil from '../../utils/ValueUtil';

const LANGUAGE_VI = 'vi';
const LANGUAGE_EN = 'en';

const getLanguage = () => {
    if (!isEmpty(ResourceManager.resource.language)) {
        return ResourceManager.resource.language;
    }
    return LANGUAGE_VI;
};

ResourceManager.loadResource('language');

class LocalizedStrings {
    // TODO: Test instance class
    static instance;

    static defaultLanguage = '';

    static defaultSource = {};

    constructor(props, language = LANGUAGE_VI) {
        // TODO: Test instance class
        // if (LocalizedStrings.instance) {
        //     return LocalizedStrings.instance;
        // }
        // LocalizedStrings.instance = this;

        this.props = props;

        if (process?.env?.NODE_ENV === 'development') StringChecker.check(props);

        Observer.getInstance('language').attach(() => {
            this.setLanguage(getLanguage());
        });

        const nativeLanguage = NativeModules?.RNResource?.language ? ValueUtil.parseData(NativeModules?.RNResource?.language) : '';

        this.setLanguage(nativeLanguage || ResourceManager.resource.language || language);
    }

    // TODO: Test instance class
    static getInstance(props, language = LANGUAGE_VI) {
        if (LocalizedStrings.instance) {
            return LocalizedStrings.instance;
        }
        LocalizedStrings.instance = new LocalizedStrings(props || LocalizedStrings?.defaultSource, language);
        return LocalizedStrings.instance;
    }

    static getLocalize(key) {
        try {
            if (!key) {
                return '';
            }
            const language = LocalizedStrings?.defaultLanguage || LANGUAGE_VI;
            const resource = LocalizedStrings?.defaultSource;
            if (typeof key === 'string') {
                return resource?.[language]?.[key] || resource?.[LANGUAGE_EN]?.[key] || resource?.[LANGUAGE_VI]?.[key] || String(key);
            } if (typeof key === 'object') {
                return key?.[language] || key?.[LANGUAGE_EN] || key?.[LANGUAGE_VI] || String(key);
            }
            return String(key);
        } catch (error) {
            console.warn('Get localize is error', error);
            return String(key);
        }
    }

    static getLanguage() {
        const language = LocalizedStrings?.defaultLanguage || LANGUAGE_VI;
        return language;
    }

    addLanguage(newLanguage) {
        try {
            if (process?.env?.NODE_ENV === 'development') StringChecker.check(newLanguage);

            const language = LocalizedStrings?.defaultLanguage || LANGUAGE_VI;

            const localizedStrings = newLanguage?.[language];

            for (const key in localizedStrings) {
                if (typeof localizedStrings === 'object' && localizedStrings?.hasOwnProperty(key)) {
                    this[key] = localizedStrings?.[key] || '';
                } else {
                    this[key] = key;
                }
            }

            const keys = Object.keys(newLanguage);

            const newProps = { ...this.props };

            for (let i = 0; i < keys.length; i++) {
                newProps[keys[i]] = { ...newProps[keys[i]], ...newLanguage[keys[i]] };
            }

            this.props = newProps;

            LocalizedStrings.defaultSource = newProps;
        } catch (e) {
            console.warn('Add language is error', e);
        }
    }

    setLanguage(language = LANGUAGE_VI) {
        try {
            const localizedStrings = this.props[language];
            LocalizedStrings.defaultLanguage = language;
            LocalizedStrings.defaultSource = this.props;
            for (const key in localizedStrings) {
                if (typeof localizedStrings === 'object' && localizedStrings.hasOwnProperty(key)) {
                    this[key] = localizedStrings?.[key] || '';
                } else {
                    this[key] = key;
                }
            }
        } catch (error) {
            console.warn('Set language is error', error);
        }
    }

    getLanguage() {
        const language = LocalizedStrings?.defaultLanguage || LANGUAGE_VI;
        return language;
    }

    getLocalize(key) {
        try {
            if (!key) {
                return '';
            }
            const language = LocalizedStrings?.defaultLanguage || LANGUAGE_VI;
            const resource = this.props;
            if (typeof key === 'string') {
                return resource?.[language]?.[key] || resource?.[LANGUAGE_EN]?.[key] || resource?.[LANGUAGE_VI]?.[key] || String(key);
            } if (typeof key === 'object') {
                return key?.[language] || key?.[LANGUAGE_EN] || key?.[LANGUAGE_VI] || String(key);
            }
            return String(key);
        } catch (error) {
            console.warn('Get localize is error', error);
            return String(key);
        }
    }

    getString(language, key) {
        if (this.props[language] && this.props[language][key]) {
            return this.props[language][key];
        }
        return '';
    }

    getObject(key) {
        try {
            if (!key) {
                return '';
            }
            const resource = this.props;
            return Object.keys(resource).reduce((acc, next) => {
                acc[next] = resource?.[next]?.[key] || '';
                return acc;
            }, {});
        } catch (error) {
            console.warn('Get object localize is error', error);
            return key;
        }
    }
}

export default LocalizedStrings;
