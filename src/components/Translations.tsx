import React from 'react';
import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

const en = require('../localizations/en.json');
const ar = require('../localizations/ar.json');

I18n.fallbacks = true; // If an English translation is not available in en.js, it will look inside hi.js
// I18n.missingBehaviour = 'guess'; // It will convert HOME_noteTitle to "HOME note title" if the value of HOME_noteTitle doesn't exist in any of the translation files.
// I18n.defaultLocale = 'en'; // If the current locale in device is not en or hi
// I18n.locale = 'ar'; // If we do not want the framework to use the phone's locale by default

I18n.translations = {
    ar,
    en
};

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

export const setLocale = (locale) => {
    I18n.locale = locale;
};

export const getCurrentLocale = () => I18n.locale; // It will be used to define initial language state in reducer.

export function isRTLMode() {
    return getCurrentLocale()==="ar";
};

/* translateHeaderText:
 screenProps => coming from react-navigation (defined in app.container.js)
 langKey => will be passed from the routes file depending on the screen.(We will explain the usage later int the coming topics)
*/
export const translateHeaderText = (langKey) => ({screenProps}) => {
    const title = I18n.translate(langKey, screenProps.language);
    return {title};
};

// The method we'll use instead of a regular string
export function strings(name) {
    return I18n.t(name);
};

export default I18n;
