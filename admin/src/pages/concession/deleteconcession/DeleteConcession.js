import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllConcessions, deleteConcession } from "../../../api/concession";
import "./DeleteConcession.css"

const ManageConcessions = () => {
    const [concessions, setConcessions] = useState([]); // State to store the list of concessions
    const [loading, setLoading] = useState(true);      // State to manage loading status

    // Fetch all concessions when the component mounts
    useEffect(() => {
        const loadConcessions = async () => {
            try {
                const response = await getAllConcessions(); // Call the API to fetch concessions
                setConcessions(response);
                console.log(response)// Assuming the API response is { data: [...] }
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch concessions.');
                console.error('Error fetching concessions:', error);
                setLoading(false);
            }
        };

        loadConcessions();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(`Bạn có chắc muốn xóa không?`);
if(confirmDelete){
        try {
            await deleteConcession(id); // Call the API to delete the concession
            setConcessions(concessions.filter(concession => concession.id !== id)); // Remove deleted concession from state
            toast.success("Concession deleted successfully!");
        } catch (error) {
            toast.error('Failed to delete concession. Please try again.');
            console.error('Error deleting concession:', error);
        }
}}
    return (
        <div className="manage-concessions">
            <h2>Danh sách đồ ăn, nước uống </h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {concessions.map(concession => (
                        <li key={concession.id}>
                            <div>
                                <h3>{concession.name}</h3>
                                <p>{concession.description}</p>
                                <p>Price: ${concession.price}</p>
                                <img src={concession.imageUrl} alt={concession.name} style={{ maxWidth: '100px' }} />
                                <button onClick={() => handleDelete(concession.id)}>Xóa</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <ToastContainer />
        </div>
    );
};

export default ManageConcessions;
