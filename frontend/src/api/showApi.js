import axiosClient from "./axiosClient";

// Function to get show by ID
export const getShowById = async (showId, token) => {
        const response = await axiosClient.get(`/api/show/${showId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to get all seats in a show
export const getAllSeatsByShowId = async (showId, token) => {
        const response = await axiosClient.get(`/api/show/${showId}/seats`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to get shows by movie ID
export const getShowsByMovieId = async (movieId, token) => {
        const response = await axiosClient.get('/api/show/frommovie', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { id: movieId },
        });
        return response.data;
};

// Function to get shows by hall ID
export const getShowsByHallId = async (hallId, token) => {
        const response = await axiosClient.get('/api/show/fromhall', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { id: hallId },
        });
        return response.data;
};

// Function to get all shows
export const getAllShows = async (token) => {
        const response = await axiosClient.get('/api/show/getall', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to add a new show
export const addShow = async (showRequest, token) => {
        const response = await axiosClient.post('/api/show/add', showRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to add a list of shows
export const addShowList = async (showRequestList, token) => {
        const response = await axiosClient.post('/api/show/addlist', showRequestList, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to update a show
export const updateShow = async (id, showRequest, token) => {
        const response = await axiosClient.put(`/api/show/${id}/update`, showRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to delete a show by ID
export const deleteShowById = async (showId, token) => {
        const response = await axiosClient.delete(`/api/show/${showId}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
};

// Function to delete shows by hall ID and movie ID
export const deleteShowsByHallIdAndMovieId = async (showRequest, token) => {
        const response = await axiosClient.delete('/api/show/deletebyhallandmovie', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: showRequest,
        });
        return response.data;

};
