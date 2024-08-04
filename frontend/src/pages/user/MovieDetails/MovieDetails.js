import React,{useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import {Link} from "react-router-dom";
import {getMovieById, getMovies} from "../../../api/movieApi";
import Cookies from "js-cookie";
import './MovieDetails.css'
const MovieDetails  = () => {
    const [movie, setMovie] = useState(null);
    const {movieId} = useParams();

    useEffect(()=>
    {
        const fetchMovieDetails = async () => {
            try {
                const token = Cookies.get('authToken');

                const moviesData = await getMovieById(movieId, token);
                setMovie(moviesData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchMovieDetails();
    },[movieId]);

    if (!movie) return <div>Loading...</div>;

    return (
        <div className='moviepage'>
            <div className='c1' style={{ backgroundImage: `url(${movie.largeImage})` }}>
                <div className='c11'>
                    <div className='left'>
                        <div className='movie_poster' style={{ backgroundImage: `url(${movie.image})` }}></div>
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
                <h1>Có thể bạn cũng thích</h1>
            </div>
            <div className='g'>
                {/* Assuming you have a component to show related movies */}
                {/* <MovieCarouselExceptCurrentFilm /> */}
            </div>
            {/* <ToastContainer /> */}
        </div>
    );
};

export default MovieDetails;