import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditHall.css';
import { getHallById, getSeatsByHallId, updateHall, updateSeatsInHall } from './../../../api/cinemahall';

const EditHall = () => {
    const { screenid } = useParams();
    const [screen, setScreen] = useState({ _id: '', name: '', rows: [], screenType: '' });
    const [rowName, setRowName] = useState('');
    const [numSeats, setNumSeats] = useState(0);
    const [rowPrice, setRowPrice] = useState(0);
    const [editScreenName, setEditScreenName] = useState('');
    const [editScreenType, setEditScreenType] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);

    useEffect(() => {
        const fetchScreen = async () => {
            try {
                const data = await getHallById(screenid);
                setScreen(data);
                console.log(data);
            } catch (error) {
                console.error('Failed to fetch screen', error);
                toast.error('Failed to fetch screen');
            }
        };

        const fetchSeats = async () => {
            try {
                const seats = await getSeatsByHallId(screenid);
                console.log("Seats", seats);
                if (seats) {
                    setScreen(prevScreen => ({
                        ...prevScreen,
                        rows: groupSeatsByRow(seats),
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch seats', error);
                toast.error('Failed to fetch seats');
            }
        };

        fetchScreen();
        fetchSeats();
    }, [screenid]);

    useEffect(() => {
        console.log("screen",screen);

    }, [screen]);
    // Hàm chuyển đổi rowIndex thành ký tự
    const convertRowIndexToLetter = (rowIndex) => {
        return String.fromCharCode(65 + rowIndex - 1); // 65 là mã ASCII của 'A'
    };

    const groupSeatsByRow = (seats) => {
        const groupedRows = {};

        seats.forEach(seat => {
            const { rowIndex, colIndex, price } = seat;
            const rowLetter = convertRowIndexToLetter(rowIndex); // Chuyển rowIndex thành ký tự
            if (!groupedRows[rowLetter]) {
                groupedRows[rowLetter] = { rowname: `Row ${rowLetter}`, cols: [], price };
            }
            groupedRows[rowLetter].cols.push({ colIndex, seat });
        });

        return Object.values(groupedRows);
    };

    const handleEditNameClick = () => {
        setIsEditingName(true);
    };

    const handleEditScreenNameChange = (event) => {
        setEditScreenName(event.target.value);
    };

    const handleNameEditDone = () => {
        if (editScreenName.trim() === '') {
            toast.error('Tên phòng chiếu không được để trống');
            return;
        }

        // Update screen name if validation passes
        setScreen(prevScreen => ({
            ...prevScreen,
            name: editScreenName,
        }));
        setIsEditingName(false);
    };


    const handleEditScreenTypeChange = (event) => {
        setEditScreenType(event.target.value);
    };

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

    const addRow = () => {
        if (rowName !== '' && numSeats > 0 && rowPrice > 0) {
            const newSeats = Array.from({ length: numSeats }, (_, index) => ({
                colIndex: index + 1,
                rowIndex: screen.rows.length + 1,
                price: rowPrice,
            }));

            const newRow = {
                rowname: rowName,
                cols: newSeats.map(seat => ({ seat })),
                price: rowPrice,
            };

            setScreen(prevScreen => ({
                ...prevScreen,
                rows: [...prevScreen.rows, newRow],
            }));

            setRowName('');
            setNumSeats(0);
            setRowPrice(0);
        } else {
            toast.error('Hãy điền đầy đủ các trường thông tin', {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    const selectdeselectseat = (seat) => {
        setScreen((prevScreen) => {
            // Clone the current rows to avoid direct mutation
            const updatedRows = prevScreen.rows.map((row) => {
                // Find the row that contains this seat based on rowIndex
                if (row.rowname === `Row ${convertRowIndexToLetter(seat.rowIndex)}`) {
                    return {
                        ...row,
                        cols: row.cols.map((col) => {
                            // Find the correct seat by colIndex
                            if (col.seat.colIndex === seat.colIndex) {
                                // Toggle the seat's walkway status
                                const updatedSeat = {
                                    ...col.seat,
                                    isWalkway: !seat.isWalkway,
                                    // If it's a walkway, clear seat_id, otherwise assign it
                                    seat_id: seat.isWalkway ? "" : `${convertRowIndexToLetter(seat.rowIndex)}${col.seat.colIndex}`,
                                };
                                return { ...col, seat: updatedSeat };
                            }
                            return col;
                        }),
                    };
                }
                return row;
            });

            return { ...prevScreen, rows: updatedRows };
        });
    };



    const handleSaveChanges = async () => {
        try {
            await updateHall(screen);

            const seatUpdates = screen.rows.flatMap(row =>
                row.cols.map(col => ({
                    col: col.seat.colIndex,
                    row: col.seat.rowIndex,
                    status: col.seat.isWalkway ? 'UNAVAILABLE' : 'AVAILABLE',
                    type: "REGULAR"
                }))
            );
            console.log("Seat update", seatUpdates);

            await updateSeatsInHall(screen.id, seatUpdates);

            toast.success('Cập nhật thành công');
        } catch (error) {
            console.error('Error updating screen or seats', error);
            toast.error('Lỗi khi cập nhật');
        }
    };

    const deleteRow = (rowIndex) => {
        setScreen(prevScreen => {
            const updatedRows = [...prevScreen.rows];
            updatedRows.splice(rowIndex, 1);
            return { ...prevScreen, rows: updatedRows };
        });
    };

    return (
        <div className='formpage1'>
            <h1>Chỉnh sửa phòng chiếu</h1>
            <p>ID phòng chiếu: {screen.id}</p>

            <div className="tenphongchieu">
                <label>Tên phòng chiếu: </label><br/>
                <h3>{screen.name}</h3>
                {!isEditingName ? (

                    <button onClick={handleEditNameClick}>Sửa</button>
                ) : (
                    <div>
                        <label>Nhập tên phòng chiếu mới</label>
                        <input
                            type="text"
                            placeholder={"Tên phòng chiếu"}
                            value={editScreenName}
                            onChange={handleEditScreenNameChange}
                        />
                        <br/>
                        <br/>
                        <button onClick={handleNameEditDone}>Xong</button>
                    </div>
                )}
            </div>


            <div className="row-container">
                <label>Tên hàng:</label>
                <input
                    type="text"
                    placeholder="Nhập tên hàng"
                    value={rowName}
                    onChange={handleRowNameChange}
                />
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
                <button onClick={addRow}>Thêm hàng</button>
            </div>

            {screen ? (
                <div>
                    {screen.rows.map((row, rowIndex) => (
                        <div className="seat-row" key={rowIndex}>
                            <div className="seat-cols">
                                {row.cols.map((col, seatIndex) => {
                                    const seat = col.seat;
                                    const seatId = `${row.rowname.replace('Row ', '')}${seat.colIndex}`;

                                    return (
                                        <div key={seatIndex}>
                                            {seat.status == "UNAVAILABLE" || seat.isWalkway ? (
                                                <span className='seat-iswalkway'>
                                                    <div className='q'>{seatId}</div>
                                                </span>
                                            ) : (
                                                <span
                                                    className={'seat-available'}
                                                    onClick={() => selectdeselectseat(seat)}
                                                >
                                                    <div className='q'>{seatId}</div>
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <button onClick={() => deleteRow(rowIndex)}>Xóa hàng</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <button onClick={handleSaveChanges}>Lưu thay đổi</button>
            <ToastContainer />
        </div>
    );
};

export default EditHall;
