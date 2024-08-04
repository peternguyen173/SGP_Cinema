import AxiosClient from "./axiosClient";


// Function to signup a new user
export const signup = async (signUpRequest) => {
        const response = await AxiosClient.post('/api/auth/signup', signUpRequest);
        return response.data;
};

// Function to login an admin user
export const adminLogin = async (loginRequest) => {
        const response = await AxiosClient.post('/api/auth/admin/login', loginRequest, { withCredentials: true });
        return response.data;
};

// Function to login a normal user
export const signInWithEmailAndPassword = async (formData) => {
    const response = await AxiosClient.post(`/api/auth/login`, formData, { withCredentials: true });
    return response.data;
}

// Function to refresh the access token
export const refreshToken = async (refreshTokenRequest) => {

        const response = await AxiosClient.post('/api/auth/refresh', refreshTokenRequest, { withCredentials: true });
        return response.data;
};

// Function to verify account by code
export const verifyAccount = async (code) => {
        const response = await AxiosClient.get(`/api/auth/verify/${code}`);
        return response.data;
};

// Function to get current user's information
export const getCurrentUserInfo = async (token) => {
        const response = await AxiosClient.get('/api/user/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to get current user's roles
export const getCurrentUserRoles = async (token) => {
        const response = await AxiosClient.get('/api/user/roles', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to request password recovery
export const forgotPassword = async (username) => {
        const response = await AxiosClient.get('/api/user/forgotpassword', {
            params: { username },
        });
        return response.data;
};

// Function to verify recovery code
export const verifyRecoveryCode = async (code) => {
        const response = await AxiosClient.get('/api/user/recovery', {
            params: { code },
        });
        return response.data;
};

// Function to set new password
export const setNewPassword = async (code, newPassword) => {
        const response = await AxiosClient.post('/api/user/recovery', null, {
            params: { code },
            data: { password: newPassword },
        });
        return response.data;
};



