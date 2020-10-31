import store from "../boot/store";
import {LANGUAGE_CHANGED, TOKEN_CHANGED, UDID_UPDATED, USER_LOGGED_IN, USER_LOGGED_OUT, ADDRESS_UPDATED} from "../actions/actionTypes";
import {setLocale} from "../components/Translations";

export function setLanguage(code) {
    setLocale(code);
    // console.log(getCurrentLocale());
    store.dispatch({
        type: LANGUAGE_CHANGED,
        payload: code,
    });
}

export function getLanguage() {
    return store.getState().User.language;
}


export function isAppRTL() {
    return store.getState().User.language === "ar";
}

export function setProfile(profile) {
    const user = {
        profile: profile,
    };
    store.dispatch({
        type: USER_LOGGED_IN,
        payload: user,
    });
}

export function logout() {
    const user = {
        profile: undefined,
    };
    store.dispatch({
        type: USER_LOGGED_OUT,
        payload: user,
    });
}

export function isUserLoggedIn(): boolean {
    if (getUser() !== undefined && getProfile() !== undefined) {
        return true;
    }
    return false;
}

export function getUser() {
    return store.getState().User.user;
}

export function getProfile() {
    return store.getState().User.user.profile;
}

export function getUserFullName() {
    return store.getState().User.user.profile.name ;
}

export function getUserEmail() {
    return store.getState().User.user.profile.email ;
}

export function hasFeaturedProduct() {
    return store.getState().User.user.profile.has_featured_product ;
}

export function getToken() {
    return store.getState().User.token;
}

export function setToken(token) {
    store.dispatch({
        type: TOKEN_CHANGED,
        payload: token,
    });
}

export function setDeviceId(value) {
    store.dispatch({
        type: UDID_UPDATED,
        payload: value,
    });
}

export function getDeviceId() {
    return store.getState().User.deviceId;
}

export function getAddress() {
    let address = store.getState().User.address;
    return store.getState().User.address;
}

export function setAddress(value) {
    store.dispatch({
        type: ADDRESS_UPDATED,
        payload: value,
    });
}
