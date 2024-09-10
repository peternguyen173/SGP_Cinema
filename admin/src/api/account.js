import axiosClient from "./axiosClient";


export const setNewPassword2 = async (token, newPassword) => {
    const response = await axiosClient.post('/user/setnewpassword',{password: newPassword})
}
// Function to get current user's information
export const getCurrentUserInfo = async (token) => {
    const response = await axiosClient.get('/user/me');
    return response.data;
};