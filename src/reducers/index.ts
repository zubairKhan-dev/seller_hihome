import {combineReducers} from "redux";
import {UserReducer} from "./User";

const appReducer = combineReducers({
    User: UserReducer,
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;

