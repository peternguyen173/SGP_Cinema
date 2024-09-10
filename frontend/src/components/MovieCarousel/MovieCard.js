import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillStarFill } from 'react-icons/bs';
import './MovieCard.css';

const MovieCard = ({ Movie }) => {
    const navigate = useNavigate();
    const { id, title, genres, image, rating } = Movie;

    // Base64 image URL
    const imageUrl = `data:image/jpeg;base64,${image}`; // Adjust mime type if necessary

    // Join genres with a comma separator
    const genresString = genres.join(', ');

    return (
        <div
            className='moviecard'
            onClick={() => navigate(`/movies/${id}`)}
        >
            <div
                className='movieimg'
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className='details'>
                <p className='title'>{title}</p>
                <p className='type'>{genresString}</p> {/* Display genres separated by commas */}
            </div>
        </div>
    );
};

export default MovieCard;
