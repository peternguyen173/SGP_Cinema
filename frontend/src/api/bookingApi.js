import axiosClient from "./axiosClient";

export const getBookingByID = async (booking_id, token) => {
    const response = await axiosClient.get(`/api/booking/${booking_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createBooking = async (bookingData, token) => {
    const response = await axiosClient.post('/api/booking/add', bookingData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getAllBookingsFromUser = async (token) => {
    const response = await axiosClient.get('/api/booking/getall', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteBookingByID = async (booking_id, token) => {
    const response = await axiosClient.delete(`/api/booking/${booking_id}/cancel`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getAllBookingsFromUserByAdmin = async (username, token) => {
    const response = await axiosClient.get(`/api/booking/user/${username}/getall`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getBookingsByIDFromUser = async (username, booking_id, token) => {
    const response = await axiosClient.get(`/api/booking/user/${username}/${booking_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const setBookingStatusFromUsername = async (username, booking_id, status, token) => {
    const response = await axiosClient.put(`/api/booking/user/${username}/${booking_id}/setstatus`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            value: status,
        },
    });
    return response.data;
};
