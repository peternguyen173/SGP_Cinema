import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import Cookies from 'js-cookie';
// Define initial state
const initialState = {
    isAuthenticated: !!Cookies.get('authToken'),
    user: null,
};

// Define action types
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const SET_USER = 'SET_USER';

// Define action creators
export const login = () => ({ type: LOGIN });
export const logout = () => ({ type: LOGOUT });
export const setUser = (user) => ({ type: SET_USER, payload: user });

// Define reducer
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                isAuthenticated: true,
            };
        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
};

// Create store
const store = createStore(authReducer, composeWithDevTools());

export default store;
