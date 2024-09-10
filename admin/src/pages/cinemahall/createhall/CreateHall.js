import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./CreateHall.css"
import {createHall, createHallWithSeats, getHallByName, updateSeatsInHall} from "../../../api/cinemahall";



const CreateHall = () => {

    const [screen, setScreen] = useState({
        name: '',
        rows: [],
        screenType: '',
    });
    const [rowName, setRowName] = useState('');
    const [numSeats, setNumSeats] = useState(0);
    const [rowPrice, setRowPrice] = useState(0);
    const [selectedSeats, setSelectedSeats] = useState([]); // Thêm state cho selectedSeats

    const handleRowNameChange = (event) => {
        setRowName(event.target.value);
    };

    const handleNumSeatsChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setNumSeats(isNaN(value) ? 0 : value);
    };

    const handleRowPriceChange = (event) => {
        const value = parseFloat(event.target.value);
        setRowPrice(isNaN(value) ? 0 : value);
    };
    const generateRowName = (index) => {
        // Generates row names as "A", "B", "C", etc.
        return String.fromCharCode(65 + index);
    };
    const addRow = () => {

        if ( numSeats > 0 && rowPrice > 0) {
            const rowName = generateRowName(screen.rows.length); // Auto-generate row name

            const newSeats = Array.from({ length: numSeats }, (_, index) => ({
                seat_id: (index + 1).toString(),
                row: rowName, // Tên hàng ghế từ input
                isWalkway: false,
            }));

            const newRow = {
                rowname: rowName,
                cols: [{ seats: newSeats }],
                price: rowPrice, // Giá từ input
            };

            setScreen((prevScreen) => ({
                ...prevScreen,
                rows: [...prevScreen.rows, newRow],
            }));

            // Reset các giá trị sau khi thêm hàng mới
            setRowName('');
            setNumSeats(0);
            setRowPrice(0);
        } else {
            toast.error('Hãy điền đầy đủ các trường thông tin', {
                position: "top-center",
            });
        }
    };

    const selectdeselectseat = (seat) => {

        setScreen((prevScreen) => {
            const updatedRows = [...prevScreen.rows];
            const { row, seat_id, isWalkway } = seat;

            // Find the index of the selected seat
            let rowIndex = -1;
            let colIndex = -1;
            let seatIndex = -1;

            updatedRows.forEach((row, i) => {
                row.cols.forEach((col, j) => {
                    col.seats.forEach((s, k) => {
                        if (s.row === seat.row && s.seat_id === seat_id) {
                            rowIndex = i;
                            colIndex = j;
                            seatIndex = k;
                        }
                    });
                });
            });

            if (rowIndex !== -1 && colIndex !== -1 && seatIndex !== -1) {
                // Toggle isWalkway value for the selected seat
                updatedRows[rowIndex].cols[0].seats[seatIndex].isWalkway = true;


                // If the selected seat becomes isWalkway, decrement seat_id of subsequent seats in the row
                if (!isWalkway) {
                    for (let i = seatIndex + 1; i < updatedRows[rowIndex].cols[colIndex].seats.length; i++) {
                        updatedRows[rowIndex].cols[colIndex].seats[i].seat_id = (parseInt(updatedRows[rowIndex].cols[colIndex].seats[i].seat_id) - 1).toString();
                    }
                } updatedRows[rowIndex].cols[colIndex].seats[seatIndex].seat_id = "";

                // Update state of the row to trigger re-render of the row
                updatedRows[rowIndex] = { ...updatedRows[rowIndex] };
            }
            console.log(prevScreen)
            return { ...prevScreen, rows: [...updatedRows] };
        });
    };




    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setScreen({ ...screen, [name]: value });
    };
    const handleScreenTypeChange = (event) => {
        const { value } = event.target;
        setScreen({ ...screen, screenType: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (screen.name === '' || screen.screenType === '' || screen.rows.length === 0) {
                toast.error('Please fill out all fields.', {
                    position: "top-center",
                });
                return;
            }

            const seats = [];
            screen.rows.forEach((row, rowIndex) => {
                row.cols[0].seats.forEach((seat, seatIndex) => {
                    seats.push({
                        row: rowIndex + 1,
                        col: seatIndex + 1,
                        type: screen.screenType,
                        status: seat.isWalkway ? 'UNAVAILABLE' : 'AVAILABLE',
                    });
                });
            });

            const hallData = {
                name: screen.name,
                totalRow: screen.rows.length,
                totalCol: screen.rows[0].cols[0].seats.length,
                seats: seats,
            };
            console.log(hallData);

            const response = await createHallWithSeats(hallData);
            if (response.data.message!="Success") {
                console.error('Hall creation failed', response);
                toast.error('Failed to create hall.', { position: "top-center" });
                return;
            }

            toast.success('Hall created successfully!', { position: "top-center" });
        } catch (error) {
            console.error('An error occurred:', error);
            toast.error('An error occurred. Please try again.', { position: "top-center" });
        }
    };





    return (
        <div className="formpage1">
            <div className='stay'>
                <br />
                <h1>Thêm phòng chiếu mới</h1>
                <br />

                <div className="input-row">
                    <label>Tên phòng chiếu:</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={screen.name}
                        onChange={handleInputChange}
                    />
                </div>


                <br />
                <div>
                    Loại phòng chiếu:
                    <label>
                        <input
                            type="radio"
                            name="screenType"
                            value="REGULAR"
                            checked={screen.screenType === 'REGULAR'}
                            onChange={handleScreenTypeChange}
                        />
                        REGULAR
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="screenType"
                            value="PREMIUM"
                            checked={screen.screenType === 'PREMIUM'}
                            onChange={handleScreenTypeChange}
                        />
                        PREMIUM
                    </label>

                </div>
                <br />
            </div>
            <h2>Thêm các hàng ghế</h2>
            <br />
            <div className="row-container">
              <label>Số ghế:</label>
                <input
                    type="text"
                    placeholder="Số ghế"
                    value={numSeats}
                    onChange={handleNumSeatsChange}
                />
                <label>Giá vé:</label>
                <input
                    type="text"
                    placeholder="Giá vé"
                    value={rowPrice}
                    onChange={handleRowPriceChange}
                />
                <button className="themhang" onClick={addRow}>Thêm hàng</button>
                <br></br><br></br>
                <p className="screen-text1">Màn hình</p>

                <div className="curve-line"></div>
            </div>

            {screen ? (
                <div>

                    {screen.rows.map((row, rowIndex) => (
                        <div className="seat-row" key={rowIndex}>
                            <div className="seat-cols">
                                {console.log(row.rowname)}

                                {row.cols[0].seats.map((seat, seatIndex) => {
                                    seat.seatId = `${row.rowname}${seatIndex + 1}`;
                                    seat.price = row.price;
                                    seat.rowname = row.rowname;

                                    return (

                                        <div key={seatIndex}>
                                            {seat.isWalkway ? (
                                                <span className='seat-iswalkway'>
                                                    <div className='q'>{row.rowname}{seat.seat_id}</div>
                                                </span>
                                            ) : (
                                                <span
                                                    className={'seat-available'}
                                                    onClick={() => selectdeselectseat(seat)}
                                                >
                                                    <div className='q'>{row.rowname}{seat.seat_id}</div>
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    ))}
                    <br></br>

                </div>

            ) : (
                <p>Loading...</p>
            )}
            <button onClick={handleSubmit}>Thêm phòng chiếu</button>
            <ToastContainer />

        </div>
    );
};

export default CreateHall;