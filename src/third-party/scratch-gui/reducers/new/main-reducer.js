import keyMirror from 'keymirror';

export const Types = keyMirror({
    SET_AUTH_DATA: null,
    RESET_AUTH_DATA: null,
    SET_ACTIVITY_DATA: null,
    RESET_ACTIVITY_DATA: null
});

export const mainReducerInitialState = {
    authData: null,
    activityData: null
};

export const mainReducer = function (state = mainReducerInitialState, action) {
    const {type, payload} = action;

    switch (type) {
    case Types.SET_AUTH_DATA:
        return {
            ...state,
            authData: payload
        };
    case Types.RESET_AUTH_DATA:
        return {
            ...state,
            authData: null
        };
    case Types.SET_ACTIVITY_DATA:
        return {
            ...state,
            activityData: payload
        };
    case Types.RESET_ACTIVITY_DATA:
        return {
            ...state,
            activityData: payload
        };
    default:
        return state;
    }
};

export const setAuthData = data => ({
    type: Types.SET_AUTH_DATA,
    payload: data
});

export const resetAuthData = () => ({
    type: Types.RESET_AUTH_DATA
});

export const setActivityData = data => ({
    type: Types.SET_ACTIVITY_DATA,
    payload: data
});

export const resetActivityData = () => ({
    type: Types.RESET_ACTIVITY_DATA
});
