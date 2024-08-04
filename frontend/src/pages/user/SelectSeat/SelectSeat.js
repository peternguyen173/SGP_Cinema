"use client";
import React, { useState, useEffect } from 'react';
import './SelectSeat.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getShowById } from "../../../api/showApi";
import { getHallById, getAllSeatsByHallId } from "../../../api/hallApi";
import Cookies from "js-cookie";
import { getMovieById } from "../../../api/movieApi";

const SelectSeat = () => {
    const params = useParams();
    const { movieId, showId } = params;
    console.log(movieId, showId);

    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [show, setShow] = useState(null);
    const [hall, setHall] = useState(null);
    const [seats, setSeats] = useState([]);
    const [finalPrice, setFinalPrice] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [additionalPrice, setAdditionalPrice] = useState(0);
    const [burnQuantity, setBurnQuantity] = useState(0);
    const [waterQuantity, setWaterQuantity] = useState(0);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [movie, setMovie] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const getShow = async () => {
        try {
            const token = Cookies.get('authToken');
            const showById = await getShowById(showId, token);
            setShow(showById);
        } catch (error) {
            console.log(error);
        }
    };

    const getHall = async (hallId) => {
        try {
            const token = Cookies.get('authToken');
            const hallById = await getHallById(hallId, token);
            setHall(hallById);
        } catch (error) {
            console.log(error);
        }
    };

    const getSeats = async (hallId) => {
        try {
            const token = Cookies.get('authToken');
            const seats = await getAllSeatsByHallId(hallId, token);
            setSeats(seats);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        console.log(seats)
    }, [seats]);
    useEffect(() => {
        if (show) {
            getHall(show.hallId);
        }
    }, [show]);

    useEffect(() => {
        if (hall) {
            getSeats(hall.id);
        }
    }, [hall]);

    const getMovie = async () => {
        try {
            const token = Cookies.get("authToken");
            const movieById = await getMovieById(movieId, token);
            setMovie(movieById);
        }
        catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getShow();
        getMovie();
    }, []);

    useEffect(() => {
        console.log(movie);
    }, [movie]);

    useEffect(() => {
        console.log(seats);
    }, [seats]);

    const colIndexToChar = (index) => {
        return String.fromCharCode(65 + index); // Convert 0 to 'A', 1 to 'B', etc.
    };

    const selectDeselectSeat = (seat) => {
        console.log(seat);
        const isSelected = selectedSeats.find((s) => s.rowIndex === seat.rowIndex && s.colIndex === seat.colIndex);
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter((s) => !(s.rowIndex === seat.rowIndex && s.colIndex === seat.colIndex)));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };
    useEffect(() => {
        console.log("select" ,selectedSeats);

    }, [selectedSeats]);

    const generateSeatLayout = () => {
        if (!seats.length) return null;

        const seatsPerRow = hall.totalCol; // Adjust this value based on your hall layout

        return (
            <div>
                {Array(Math.ceil(seats.length / seatsPerRow)).fill().map((_, rowIndex) => (
                    <div className="seat-row" key={rowIndex}>
                        {seats.slice(rowIndex * seatsPerRow, (rowIndex + 1) * seatsPerRow).map((seat, seatIndex) => (
                            <span
                                key={seat.id}
                                className={
                                    seat.status === 'UNAVAILABLE'
                                        ? 'seat-unavailable'
                                        : selectedSeats.find((s) =>  s.rowIndex === seat.rowIndex && s.colIndex === seat.colIndex)
                                            ? 'seat-selected'
                                            : 'seat-available'
                                }
                                onClick={() => selectDeselectSeat(seat)}
                            >
                                <div className="f">{colIndexToChar(seat.rowIndex)}{seat.colIndex+1}</div>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    const handleBurnChange = (e) => {
        const quantity = parseInt(e.target.value);
        setBurnQuantity(quantity);
        updatePrice(quantity, waterQuantity);
    };

    const handleWaterChange = (e) => {
        const quantity = parseInt(e.target.value);
        setWaterQuantity(quantity);
        updatePrice(burnQuantity, quantity);
    };

    const updatePrice = (burnQty, waterQty) => {
        const burnPrice = 40000 * burnQty;
        const waterPrice = 20000 * waterQty;
        const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0) + burnPrice + waterPrice;

        setAdditionalPrice(burnPrice + waterPrice);
        setFinalPrice(totalPrice);
    };

    const calculateTotalPrice = async () => {
        try {
            const basePrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
            const promotionsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getpromotions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const promotionsData = await promotionsResponse.json();
            if (promotionsData.ok) {
                const formattedDateString = show.startTime.split('T')[0]; // Assuming startTime is in ISO format
                const currentDate = new Date(formattedDateString);
                const validPromotion = promotionsData.data.find((promotion) => {
                    const startDate = new Date(promotion.startDate);
                    const expiryDate = new Date(promotion.expiryDate);
                    return startDate < currentDate && currentDate < expiryDate;
                });

                let totalPrice = basePrice;
                let discountAmount = 0;

                if (validPromotion) {
                    if (validPromotion.type === 'percentage') {
                        discountAmount = (validPromotion.discount / 100) * basePrice;
                        totalPrice -= discountAmount;
                        setDiscount(discountAmount);
                    } else if (validPromotion.type === 'fixed') {
                        totalPrice -= validPromotion.discount;
                        setDiscount(validPromotion.discount);
                    }
                    const burnPrice = 40000 * burnQuantity;
                    const waterPrice = 20000 * waterQuantity;
                    totalPrice += burnPrice + waterPrice;

                    setFinalPrice(totalPrice);
                } else {
                    setDiscount(0);
                    setAdditionalPrice(0);
                    setFinalPrice(totalPrice);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        calculateTotalPrice();
    }, [selectedSeats]);

    const handleBooking = async () => {
        try {
            const token = Cookies.get('authToken');
            const seatIds = selectedSeats.map(seat => seat.id); // Assuming `seat.id` is the identifier for each seat

            const bookingData = {
                seat_ids: seatIds,
                show_id: showId,
                paymentMethod: 'NET_BANKING', // Example payment method
                finalPrice: finalPrice // Make sure this is a number
            };
console.log(bookingData)
            const response = await fetch(`http://localhost:8080/api/booking/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            if (response.ok) {
                createNotification('Your booking was successful!');
                toast.success('Booking Successful');
                setBookingConfirmed(true);
            } else {
                console.error(result);
                toast.error('Booking Failed');
            }
        } catch (error) {
            console.error('Error during booking:', error);
            toast.error('Booking Failed');
        }
    };
    const createNotification = (message) => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/notifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error creating notification:', error));
    };

    const updateFinalPrice = () => {
        const basePrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
        let totalPrice = basePrice + additionalPrice;
        totalPrice -= discount;
        setFinalPrice(totalPrice);
    };

    useEffect(() => {
        updateFinalPrice();
    }, [selectedSeats, additionalPrice]);

    return (
        <div className='selectseatpage'>
            {movie && hall && (
                <div className='s1'>
                    <div className='head'>
                        <h1>{movie.title} - {hall.name}</h1>
                        <h3>{movie.genres[0].genre}</h3>
                    </div>
                </div>
            )}

            {hall && (
                <div className="selectseat">
                    <div className='timecont'>
                        {show && show.schedule && show.schedule.map((time, index) => (
                            <h3
                                className={selectedTime?._id === time._id ? 'time selected' : 'time'}
                                onClick={() => {
                                    setSelectedTime(time);
                                    setSelectedSeats([]);
                                }} key={index}
                            >
                                Giờ chiếu: {time.showTime}
                            </h3>
                        ))}
                    </div>
                    <div className='indicators'>
                        <div>
                            <span className='seat-unavailable'></span>
                            <p>Đã có người đặt</p>
                        </div>
                        <div>
                            <span className='seat-available'></span>
                            <p>Chưa có người đặt</p>
                        </div>
                        <div>
                            <span className='seat-selected'></span>
                            <p>Checked</p>
                        </div>
                    </div>
                    <p className="screen-text">Màn hình</p>
                    <br></br>

                    <div className="curve-line"></div>
                    <br></br>

                    {generateSeatLayout()}

                    <div className='totalcont'>
                        <div className='totalcont1'>
                            <div className='column1'>
                                <h2>Vé</h2>
                                <br></br>
                                <h2>Bỏng</h2>
                                <h2>Nước</h2>
                                <br></br>
                                <h2>Tổng thanh toán</h2>
                                <br></br><br></br>
                            </div>
                            <div className='column2'>
                                <h3>{selectedSeats.reduce((acc, seat) => acc + seat.price, 0)} đ</h3>
                                <br></br>
                                <div className='additional-options'>
                                    <label>
                                        <h3 className='i'><input type="number" value={burnQuantity} onChange={handleBurnChange} />*40.000 đ</h3>
                                    </label>
                                    <label>
                                        <h3 className='i'><input type="number" value={waterQuantity} onChange={handleWaterChange} />*20.000 đ</h3>
                                    </label>
                                </div><br></br>
                                <h4>{finalPrice !== null ? Math.max(0, finalPrice) : 0} đ</h4>
                                <br></br>
                                <button className='theme_btn1 linkstylenone' onClick={handleBooking}>Đặt vé</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectSeat;
