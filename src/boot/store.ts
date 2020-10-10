import {applyMiddleware, createStore} from "redux";
import rootReducer from "../reducers";
import {persistReducer, persistStore} from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const persistConfig = {
    key: "root",
    version: 1,
    storage: AsyncStorage,
    whitelist: [
        'User',
    ],
    stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer(persistConfig, rootReducer);

const middleware = applyMiddleware(thunk, logger);

let store = createStore(pReducer, middleware);

export default  store;

export const persistedStore = persistStore(store);
