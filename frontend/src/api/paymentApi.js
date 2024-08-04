import axiosClient from "./axiosClient";

export const createPayment = async (paymentData, token) => {
    const response = await axiosClient.post('/api/payment/create', paymentData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getPaymentById = async (id, token) => {
    const response = await axiosClient.get(`/api/payment/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const verifyPaymentById = async (id, token) => {
    const response = await axiosClient.post(`/api/payment/${id}/verify`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getAllPaymentsOfUser = async (token) => {
    const response = await axiosClient.get('/api/payment/getall', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createHash = async (hashData) => {
    const response = await axiosClient.post('/api/payment/createhash', hashData);
    return response.data;
};
