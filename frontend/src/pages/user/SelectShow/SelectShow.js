"use client";
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for styling
import './SelectShow.css';
import { Link, useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import { getMovieById, getMovies } from "../../../api/movieApi";
import { getShowsByMovieId } from "../../../api/showApi";

const SelectShow = () => {
    const params = useParams();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { movieId } = params;
    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState(null);

    const getMovie = async () => {
        try {
            const token = Cookies.get('authToken');
            const moviesData = await getMovieById(movieId, token);
            setMovie(moviesData);
        } catch (error) {
            console.log(error);
        }
    };

    const getShows = async (date) => {
        try {
            const token = Cookies.get('authToken');
            const showsByMovie = await getShowsByMovieId(movieId, token);
            console.log("Fetched shows:", showsByMovie); // Log the fetched shows
            setShows(showsByMovie);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getMovie();
    }, []);

    useEffect(() => {
        getShows();
    }, [selectedDate]);

    return (
        <>
            <div className='buytickets'>
            {movie && (
                    <div className='s1'>
                        <div className='head'>
                            <h1>{movie.title} - {movie.language}</h1>
                            <h3>{movie.genres.join(",")}</h3>
                        </div>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="MMMM d, yyyy"
                        />
                    </div>
            )}
            {shows && (
                <div className='screens'>
                    {Array.from(new Set(shows.map(show => show.hallId))).map((uniqueHallId, index) => {
                        const uniqueHall = shows.find(show => show.hallId === uniqueHallId);
                        return (
                            <div className='screen' key={index}>
                                <div className='a'>
                                    <h2>{uniqueHall.hallName}</h2>
                                    <div className='showtimes'>
                                        {shows.filter(show => {
                                            const showDate = new Date(show.startTime);
                                            console.log("Show date:", showDate, "Selected date:", selectedDate); // Log dates
                                            return showDate.toDateString() === selectedDate.toDateString() && show.movieId === movieId && show.hallId === uniqueHallId;
                                        }).map((filteredShow, showIndex) => (
                                            <div className='showtime' key={showIndex}>
                                                <p>Thời gian chiếu: {new Date(filteredShow.startTime).toLocaleTimeString()}</p>
                                                <p><Link
                                                    to={`/selectseat/${movieId}/${filteredShow.showID}`}
                                                    className='theme_btn1 linkstylenone'
                                                >
                                                    Đặt vé
                                                </Link>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            </div>

        </>
    );
};

export default SelectShow;
