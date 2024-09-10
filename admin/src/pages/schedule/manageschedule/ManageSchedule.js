import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ManageSchedule.css';
import { getMovies } from "../../../api/movie";
import { getShowsByMovieId, deleteShowById } from "../../../api/cinemashow"; // Assuming you have a delete API function

const ManageSchedule = () => {
    const [movies, setMovies] = useState([]); // State to store the list of movies
    const [selectedMovieId, setSelectedMovieId] = useState(null); // State to store the selected movie ID
    const [shows, setShows] = useState([]); // State to store shows of the selected movie

    // Fetch the list of movies from the backend
    const fetchMovies = async () => {
        try {
            const response = await getMovies(0, 200);
            setMovies(response); // Update state with movies from API
        } catch (error) {
            toast.error('Failed to fetch movies');
        }
    };

    // Fetch shows for a specific movie
    const fetchShowsByMovieId = async (movieId) => {
        try {
            const response = await getShowsByMovieId(movieId);
            console.log(response)
            setShows(response); // Update state with shows from API
        } catch (error) {
            toast.error('Failed to fetch shows');
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []); // Fetch movies on initial render

    // Handle clicking on a movie to fetch and display its shows
    const handleMovieClick = (movieId) => {
        if (selectedMovieId === movieId) {
            setSelectedMovieId(null);
            setShows([]); // Clear shows if the same movie is clicked again
        } else {
            setSelectedMovieId(movieId);
            fetchShowsByMovieId(movieId); // Fetch shows for the selected movie
        }
    };

    // Handle deleting a show
    const handleDeleteShow = async (showId) => {
        try {
            await deleteShowById(showId); // Assuming this function deletes the show
            toast.success('Show deleted successfully');
            // Re-fetch the shows after deletion
            fetchShowsByMovieId(selectedMovieId);
        } catch (error) {
            toast.error('Failed to delete the show');
        }
    };

    return (
        <div className="manage-schedule-page">
            <h2>Danh sách các Phim:</h2>
            <ul>
                {movies.map((movie) => (
                    <li key={movie.id}>
                        <button
                            onClick={() => handleMovieClick(movie.id)}
                            className={selectedMovieId === movie.id ? 'selected' : ''}
                        >
                            {movie.title}
                        </button>
                        {selectedMovieId === movie.id && (
                            <ul>
                                {shows.map((show) => (
                                    <li className="show" key={show.id}>
                                        <p>Rạp: {show.hallName}</p>
                                        <p>Giờ bắt đầu: {new Date(show.startTime).toLocaleString()}</p>
                                        <p>Giờ kết thúc: {new Date(show.endTime).toLocaleString()}</p>
                                        <p>Số ghế tổng: {show.totalSeats}</p>
                                        <p>Số ghế đã đặt: {show.totalReversedSeats}</p>
                                        <p>Số ghế còn lại: {show.totalAvailableSeats}</p>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteShow(show.showID)}
                                            disabled={show.totalReversedSeats > 0}
                                            className={show.totalReversedSeats > 0 ? 'delete-btn disabled' : 'delete-btn'}
                                        >
                                            Xóa
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
            <ToastContainer />
        </div>
    );
};

export default ManageSchedule;
