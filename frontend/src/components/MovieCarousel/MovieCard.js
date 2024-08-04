import React from 'react';
import { useNavigate } from 'react-router-dom'; // Replace with your routing library if not using react-router-dom
import { BsFillStarFill } from 'react-icons/bs';
import './MovieCard.css';

const MovieCard = ({ Movie }) => {
    const navigate = useNavigate();
    const { id, title, genres } = Movie;

    return (
        <div
            className='moviecard'
            onClick={() => {
                navigate(`/movies/${id}`);
            }}
        >
            <div
                className='movieimg'
                style={{
                   // backgroundImage: `url(${portraitImgUrl})`
                }}
            >
                <p className='rating'>
                    <BsFillStarFill className='star' />&nbsp;&nbsp;
                    1/10
                </p>
            </div>
            <div className='details'>
                <p className='title'>{title}</p>
                <p className='type'>{genres[0].genre}</p>
            </div>
        </div>
    );
};

export default MovieCard;
