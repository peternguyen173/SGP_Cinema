const initialState = {
    isLoggedIn: false,
    admin: null,
};

export const authReducer = (state = initialState, action) => {
    console.log('Reducer action:', action); // Debug log
    switch (action.type) {
        case 'SET_ADMIN':
            console.log(state)
            return {
                ...state,
                admin: action.payload,
                isLoggedIn: true,
            };
        case 'CLEAR_ADMIN':
            return {
                ...state,
                admin: null,
                isLoggedIn: false,
            };
        default:
            return state;
    }
};