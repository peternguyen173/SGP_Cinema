import axiosClient from "./axiosClient";


// Function to get all users
export const getAllUsers = async (token) => {
        const response = await axiosClient().get('/api/user/getall', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to get user by username
export const getUserByUsername = async (username, token) => {
        const response = await axiosClient.get(`/api/user/info/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to search user by username
export const searchUserByUsername = async (username, token) => {
        const response = await axiosClient.get('/api/user/search', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { username },
        });
        return response.data;
};

// Function to delete user by username
export const deleteUserByUsername = async (username, token) => {
        const response = await axiosClient.delete('/api/user/delete', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { username },
        });
        return response.data;
};

// Function to give admin role to user
export const giveAdminRole = async (username, token) => {
        const response = await axiosClient.get('/api/user/giveadmin', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { username },
        });
        return response.data;
};

// Function to remove admin role from user
export const removeAdminRole = async (username, token) => {
        const response = await axiosClient.get('/api/user/removeadmin', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { username },
        });
        return response.data;
};

// Function to get current user's information
export const getCurrentUserInfo = async (token) => {
        const response = await axiosClient.get('/api/user/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to get current user's roles
export const getCurrentUserRoles = async (token) => {
        const response = await axiosClient.get('/api/user/roles', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to request password recovery
export const forgotPassword = async (username) => {
        const response = await axiosClient.get('/api/user/forgotpassword', {
            params: { username },
        });
        return response.data;
};

// Function to verify recovery code
export const verifyRecoveryCode = async (code) => {
        const response = await axiosClient.get('/api/user/recovery', {
            params: { code },
        });
        return response.data;

};

// Function to set new password
export const setNewPassword = async (code, newPassword) => {
        const response = await axiosClient.post('/api/user/recovery', null, {
            params: { code },
            data: { password: newPassword },
        });
        return response.data;

};
