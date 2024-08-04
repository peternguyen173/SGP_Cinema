import React from 'react'
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import "./MovieCarousel.css"
import {useState, useEffect} from "react";
import {getMovies} from "../../api/movieApi";
// import MovieCard from './MovieCard';


import MovieCard from './MovieCard';
import {Link} from "react-router-dom";

const MovieCarousel = () => {

    const [user, setUser] = useState(null)
    const [movies, setMovies] = useState([])

    const fetchMovies = async () => {
        try {
            const moviesData = await getMovies();
          //  console.error('Success fetching movies:');
            setMovies(moviesData);

        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };
    useEffect(() => {
        // Define and immediately invoke an async function

        fetchMovies(); // Call the async function
    }, []); // Empty dependency array ensures this runs once when the component mounts

    useEffect(() => {
        console.log("movies", movies);
    }, [movies]); // This will log the movies whenever they change

    return (
        <div className='sliderout'>
            {
                movies &&
                <div className='moviecarou'>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={1}
                        pagination={{
                            clickable: true,
                        }}
                        breakpoints={{
                            '@0.00': {
                                slidesPerView: 1,
                                spaceBetween: 2,
                            },
                            '@0.75': {
                                slidesPerView: 2,
                                spaceBetween: 2,
                            },
                            '@1.00': {
                                slidesPerView: 3,
                                spaceBetween: 2,
                            },
                            '@1.50': {
                                slidesPerView: 6,
                                spaceBetween: 2,
                            },
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                    >
                        {
                            movies.map((Movie) => {
                                return (
                                    <SwiperSlide key={Movie.id}>
                                        <Link to={`/movies/${Movie.id}`} className="linkstylenone">
                                        <MovieCard
                                            Movie={Movie}
                                            user={user}
                                        />
                                        </Link>
                                    </SwiperSlide>
                                )
                            })
                        }
                    </Swiper>
                </div>
            }
        </div>
    )
}

export default MovieCarousel