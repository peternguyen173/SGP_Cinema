import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addConcession } from "../../../api/concession";

const CreateConcession = () => {
    const [id, setId] = useState('');               // State for the ID of the concession
    const [name, setName] = useState('');           // State for the name of the concession
    const [imageURL, setImageURL] = useState('');   // State for the image URL of the concession
    const [price, setPrice] = useState('');         // State for the price of the concession
    const [description, setDescription] = useState(''); // State for the description of the concession

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        if ( !name || !imageURL || !description || isNaN(price) || parseFloat(price) <= 0) {
            toast.error("Please enter valid details.");
            return;
        }

        const concessionData = {
            name,
            imageURL,
            description,
            price: parseFloat(price),
        };

        try {
            const response = await addConcession(concessionData); // Call the API to add concession
            toast.success("Concession added successfully!");
            // Optionally clear the form
            setName('');
            setImageURL('');
            setPrice('');
            setDescription('');
        } catch (error) {
            toast.error('Failed to add concession. Please try again.');
            console.error('Error adding concession:', error);
        }
    };

    return (
        <div className="create-concession">
            <h2>Tạo đồ ăn, nước uống mới</h2>
            <form onSubmit={handleSubmit}>

                <div>
                    <label>Tên:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Url ảnh:</label>
                    <input
                        type="text"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Giá:</label>
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mô tả:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit">Thêm mới</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default CreateConcession;
