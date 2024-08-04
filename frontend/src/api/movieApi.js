import axiosClient from "./axiosClient";

export const getMovies = async (pageNumber = 0, pageSize = 100000) => {
    const response = await axiosClient.get('/api/movie/getall', {
        params: { pageNumber, pageSize }
    });
    return response.data;
};

export const searchMoviesByTitle = async (key, pageNumber = 0, pageSize = 50) => {
    const response = await axiosClient.get('/api/movie/searchbytitle', {
        params: { key, pageNumber, pageSize }
    });
    return response.data;
};

export const getMovieById = async (id, token) => {
    const response = await axiosClient.get(`/api/movie/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const searchMoviesByGenre = async (key, pageNumber = 0, pageSize = 50) => {
    const response = await axiosClient.get('/api/movie/searchbygenre', {
        params: { key, pageNumber, pageSize }
    });
    return response.data;
};

export const addMovie = async (movie, token) => {
    const response = await axiosClient.post('/api/movie/add', movie, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const addMovieList = async (movies, token) => {
    const response = await axiosClient.post('/api/movie/addlist', movies, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateMovie = async (id, movie, token) => {
    const response = await axiosClient.put(`/api/movie/${id}/edit`, movie, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteMovie = async (id, token) => {
    const response = await axiosClient.delete(`/api/movie/${id}/delete`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
