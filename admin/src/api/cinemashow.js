import instance from './axiosClient';  // Assuming axiosClient is pre-configured

// Get a specific show by its ID
export const getShowById = async (showId) => {
    try {
        const response = await instance.get(`/show/${showId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching show by ID:", error);
    }
};

// Get all seats for a specific show
export const getAllSeatsByShowId = async (showId) => {
    try {
        const response = await instance.get(`/show/${showId}/seats`);
        return response.data;
    } catch (error) {
        console.error("Error fetching seats for show:", error);
    }
};

// Get all shows related to a specific movie ID
export const getShowsByMovieId = async (movieId) => {
    try {
        const response = await instance.get(`/show/frommovie`, {
            params: { id: movieId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching shows by movie ID:", error);
    }
};

// Get all shows in a specific hall by hall ID
export const getShowsByHallId = async (hallId) => {
    try {
        const response = await instance.get(`/show/fromhall`, {
            params: { id: hallId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching shows by hall ID:", error);
    }
};

// Get all shows (Admin required)
export const getAllShows = async () => {
    try {
        const response = await instance.get(`/show/getall`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all shows:", error);
    }
};

// Add a new show (Admin required)
export const addShow = async (showData) => {
    try {
        const response = await instance.post(`/show/add`, showData);
        return response.data;
    } catch (error) {
        console.error("Error adding new show:", error);
    }
};

// Add a list of new shows (Admin required)
export const addShowList = async (showList) => {
    try {
        const response = await instance.post(`/show/addlist`, showList);
        return response.data;
    } catch (error) {
        console.error("Error adding list of shows:", error);
    }
};

// Update a show by its ID (Admin required)
export const updateShowById = async (id, showData) => {
    try {
        const response = await instance.put(`/show/${id}/update`, showData);
        return response.data;
    } catch (error) {
        console.error("Error updating show:", error);
    }
};

// Delete a show by its ID (Admin required)
export const deleteShowById = async (showId) => {
    try {
        const response = await instance.delete(`/show/${showId}/delete`);
        return response.data;
    } catch (error) {
        console.error("Error deleting show by ID:", error);
    }
};

// Delete a show by hall and movie (Admin required)
export const deleteShowByHallAndMovie = async (showData) => {
    try {
        const response = await instance.delete(`/show/deletebyhallandmovie`, { data: showData });
        return response.data;
    } catch (error) {
        console.error("Error deleting show by hall and movie:", error);
    }
};
