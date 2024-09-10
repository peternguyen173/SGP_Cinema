export const login = (token, refreshToken) => {
    Cookies.set('authToken', token, { expires: 7 });
    Cookies.set('refreshToken', refreshToken, { expires: 7 });
    return {
        type: 'LOGIN',
    };
};

export const logout = () => {
    Cookies.remove('authToken');
    Cookies.remove('refreshToken');
    return {
        type: 'LOGOUT',
    };
};
