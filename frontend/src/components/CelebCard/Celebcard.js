import React from 'react';
import './CelebCard.css';

const Celebcard = ({ name,imageUrl,_id, role }) => {
    return (
        <div className='celebcard'>
            <img src={imageUrl} alt={name} width={200} height={200} />
            <h3>{name}</h3>
            <h4>{role}</h4>
        </div>
    );
}

export default Celebcard;
