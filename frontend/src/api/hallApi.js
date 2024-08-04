import axiosClient from "./axiosClient";

// Function to get hall by ID
export const getHallById = async (hallId, token) => {
        const response = await axiosClient.get(`/api/hall/${hallId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to get all halls
export const getAllHalls = async (token) => {
        const response = await axiosClient.get('/api/hall/getall', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to add a new hall
export const addNewHall = async (hallRequest, token) => {
        const response = await axiosClient.put('/api/hall/new', hallRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to delete hall by ID
export const deleteHallById = async (hallId, token) => {
        const response = await axiosClient.delete(`/api/hall/${hallId}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to edit hall by ID
export const editHallById = async (hallId, hallRequest, token) => {
        const response = await axiosClient.put(`/api/hall/${hallId}/edit`, hallRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;

};

// Function to get all seats by hall ID
export const getAllSeatsByHallId = async (hallId, token) => {
        const response = await axiosClient.get(`/api/hall/${hallId}/seat/getall`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to edit seats by hall ID
export const editSeatsByHallId = async (hallId, seatEditRequest, token) => {
        const response = await axiosClient.put(`/api/hall/${hallId}/seat/edit`, seatEditRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};
