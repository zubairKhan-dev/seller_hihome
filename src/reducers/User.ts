import {LANGUAGE_CHANGED, TOKEN_CHANGED, UDID_UPDATED, USER_LOGGED_IN, USER_LOGGED_OUT, ADDRESS_UPDATED, SET_SELLER} from "../actions/actionTypes";
import {getLanguage} from "../lib/user";
import {REHYDRATE} from "redux-persist/es/constants";

let defaultState = {
    user: undefined,
    language: "en",
    token: undefined,
    deviceId: undefined,
    address: undefined,
    seller: undefined,
};

export function UserReducer(state = defaultState, action) {
    switch (action.type) {

        case LANGUAGE_CHANGED:
            return {...state, language: action.payload};

        case USER_LOGGED_IN:
            return {...state, user: action.payload};

        case USER_LOGGED_OUT:
            return {...state, user: undefined};

        case TOKEN_CHANGED:
            return {...state, token: action.payload};

        case UDID_UPDATED:
            return {...state, deviceId: action.payload};

        case ADDRESS_UPDATED:
            return {...state, address: action.payload};
        case SET_SELLER:
            return {...state, seller: action.payload};
        // case REHYDRATE:
        //     return {
        //         ...state,
        //         language: action.payload.language ?  action.payload.language : defaultState.language
        //     };
        default:
            return state;
    }
}
