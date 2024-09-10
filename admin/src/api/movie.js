    import instance from "./axiosClient";

    export const createmovie = async (movie) => {
        try {
            const response = await instance.post("/movie/add", movie);
            return response.data
        } catch (error) {
            console.log(error);
        }
    }

    export const updatemovie = async (movie) => {
        try {
            const response = await instance.put(`/movie/${movie.id}/edit`, movie);
            return response.data
        } catch (error) {
            console.log(error);
        }
    }

    // Delete a movie by ID (Admin required)
    export const deleteMovie = async (id) => {
        try {
            const response = await instance.delete(`/movie/${id}/delete`);
            return response.data;
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    }

    // Get a list of all movies with pagination
    export const getMovies = async (pageNumber = 0, pageSize = 100000) => {
        try {
            const response = await instance.get(`/movie/getall`, {
                params: { pageNumber, pageSize }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    }

    // Search movies by title with pagination
    export const searchMoviesByTitle = async (key, pageNumber = 0, pageSize = 50) => {
        try {
            const response = await instance.get(`/movie/searchbytitle`, {
                params: { key, pageNumber, pageSize }
            });
            return response.data;
        } catch (error) {
            console.error("Error searching movies by title:", error);
        }
    }

    // Get movie details by ID
    export const getMovieById = async (id) => {
        try {
            const response = await instance.get(`/movie/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }

    // Search movies by genre with pagination
    export const searchMoviesByGenre = async (key, pageNumber = 0, pageSize = 50) => {
        try {
            const response = await instance.get(`/movie/searchbygenre`, {
                params: { key, pageNumber, pageSize }
            });
            return response.data;
        } catch (error) {
            console.error("Error searching movies by genre:", error);
        }
    }


