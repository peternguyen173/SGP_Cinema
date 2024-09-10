import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllHalls, updateHall, deleteHall } from "../../../api/cinemahall"; // Adjust the import path if necessary
import './UpdateHall.css';

const UpdateHall = () => {
    const [screens, setScreens] = useState([]); // State để lưu danh sách màn hình
    const [selectedScreenId, setSelectedScreenId] = useState(null); // State để lưu màn hình được chọn
    const [screenName, setScreenName] = useState(''); // State để lưu tên mới của màn hình

    // Fetch screens from API
    const fetchScreens = async () => {
        try {
            const data = await getAllHalls();
            setScreens(data); // Update state with screens from the API
        } catch (error) {
            console.error('Failed to fetch screens', error);
            toast.error('Failed to fetch screens');
        }
    };

    // Function to handle screen selection
    const handleScreenClick = (screenId) => {
        setSelectedScreenId(screenId);
        const selectedScreen = screens.find((screen) => screen._id === screenId);
        if (selectedScreen) {
            setScreenName(selectedScreen.name);
        }
        window.location.href = `/managehall/${screenId}`
    };

    // Function to handle screen name change
    const handleScreenNameChange = (event) => {
        setScreenName(event.target.value);
    };

    // Function to update screen name
    const handleUpdateScreen = async () => {
        try {
            if (!selectedScreenId) {
                toast.error('Vui lòng chọn một phòng chiếu');
                return;
            }

            const response = await updateHall({ id: selectedScreenId, name: screenName });

            if (response) {
                toast.success('Cập nhật thông tin phòng chiếu thành công');
                fetchScreens(); // Re-fetch screens after update
            } else {
                toast.error('Cập nhật thông tin phòng chiếu thất bại');
            }
        } catch (error) {
            console.error('Error updating screen:', error);
            toast.error('Error updating screen');
        }
    };

    // Function to delete a screen
    const handleDeleteScreen = async (screenId) => {
        try {
            const response = await deleteHall(screenId);

            if (response) {
                toast.success('Xóa phòng chiếu thành công');
                fetchScreens(); // Re-fetch screens after deletion
            } else {
                toast.error('Xóa phòng chiếu thất bại');
            }
        } catch (error) {
            console.error('Error deleting screen:', error);
            toast.error('Error deleting screen');
        }
    };

    useEffect(() => {
        fetchScreens();
    }, []); // Fetch screens on initial render

    return (
        <div className="edit-screen-page">
            <h2>Danh sách các phòng chiếu:</h2>
            <table>
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên Phòng Chiếu</th>
                    <th>Chỉnh sửa</th>
                    <th>Xóa</th> {/* Add Delete column */}
                </tr>
                </thead>
                <tbody>
                {screens && screens.map((screen, index) => (
                    <tr key={screen._id}>
                        <td>{index + 1}</td>
                        <td>{screen.name}</td>
                        <td>
                            <button onClick={() => handleScreenClick(screen.id)}>Chỉnh sửa</button>
                        </td>
                        <td>
                            <button onClick={() => handleDeleteScreen(screen.id)}>Xóa</button> {/* Add Delete button */}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
};

export default UpdateHall;
