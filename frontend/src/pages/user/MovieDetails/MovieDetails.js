import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { getMovieById } from "../../../api/movieApi";
import Cookies from "js-cookie";
import './MovieDetails.css';
import MovieCarousel from "../../../components/MovieCarousel/MovieCarousel";

const MovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const { movieId } = useParams();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const token = Cookies.get('authToken');
                const moviesData = await getMovieById(movieId, token);
                setMovie(moviesData);
            } catch (error) {
                console.log(error);
            }
        }
        fetchMovieDetails();
    }, [movieId]);

    if (!movie) return <div>Loading...</div>;

    // Convert base64 string to URL
    const imageUrl = `data:image/jpeg;base64,${movie.image}`;
    const largeImageUrl = `data:image/jpeg;base64,${movie.largeImage}`;

    return (
        <div className='moviepage'>
            <div className='c1' style={{ backgroundImage: `url(${largeImageUrl})` }}>
                <div className='c11'>
                    <div className='left'>
                        <div
                            className='movie_poster'
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        ></div>
                        <div className='movie_details'>
                            <p className='duration_type_releasedat'>
                                <span className='duration'>Thời lượng: {movie.durationInMins} phút</span>
                            </p>
                            <span className='type'>Thể loại: {movie.genres.join(', ')}</span>
                            <span className='releasedate'>Khởi chiếu: {new Date(movie.releaseDate).toLocaleDateString()}</span>
                            <Link to={`/movies/${movie.id}/selectshow`} className='linkstylenone'>
                                <button className='bookbtn'>Đặt vé</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className='c2'>
                <h1>Thông tin về phim</h1>
                <p>{movie.description}</p>
                <div className='line'></div>
            </div>
            <div className='g'>
                {/* Assuming you have a component to show related movies */}
                {/* <MovieCarouselExceptCurrentFilm /> */}
            </div>
        </div>
    );
};

export default MovieDetails;
