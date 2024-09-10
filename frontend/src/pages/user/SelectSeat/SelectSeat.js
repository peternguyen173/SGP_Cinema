    "use client";
    import React, { useState, useEffect } from 'react';
    import './SelectSeat.css';
    import { useParams, useNavigate } from 'react-router-dom';
    import { toast } from 'react-toastify';
    import { getAllSeatsByShowId, getShowById } from "../../../api/showApi";
    import { getHallById } from "../../../api/hallApi";
    import Cookies from "js-cookie";
    import { getMovieById } from "../../../api/movieApi";
    import { CSSTransition, TransitionGroup } from 'react-transition-group';
    import { getAllConcessions } from "../../../api/concessionApi";

    const SelectSeat = () => {
        const navigate = useNavigate();
        const { movieId, showId } = useParams();

        const [bookingConfirmed, setBookingConfirmed] = useState(false);
        const [show, setShow] = useState(null);
        const [hall, setHall] = useState(null);
        const [seats, setSeats] = useState([]);
        const [concessions, setConcessions] = useState([]);
        const [finalPrice, setFinalPrice] = useState(0);
        const [discount, setDiscount] = useState(0);
        const [selectedSeats, setSelectedSeats] = useState([]);
        const [selectedConcessions, setSelectedConcessions] = useState({});
        const [movie, setMovie] = useState(null);
        const [selectedTime, setSelectedTime] = useState(null);
        const [step, setStep] = useState(1);
        const [direction, setDirection] = useState('');
        const [qrCode, setQrCode] = useState(null);

        useEffect(() => {
            const fetchShowData = async () => {
                try {
                    const token = Cookies.get('authToken');
                    const showData = await getShowById(showId, token);
                    setShow(showData);
                } catch (error) {
                    console.log(error);
                }
            };

            const fetchMovieData = async () => {
                try {
                    const token = Cookies.get("authToken");
                    const movieData = await getMovieById(movieId, token);
                    setMovie(movieData);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchShowData();
            fetchMovieData();
        }, [showId, movieId]);

        useEffect(() => {
            const fetchHallAndSeats = async () => {
                if (show) {
                    try {
                        const token = Cookies.get('authToken');
                        const hallData = await getHallById(show.hallId, token);
                        setHall(hallData);

                        const seatsData = await getAllSeatsByShowId(showId, token);
                        seatsData.sort((a, b) => (a.rowIndex === b.rowIndex ? a.colIndex - b.colIndex : a.rowIndex - b.rowIndex));
                        setSeats(seatsData);
                    } catch (error) {
                        console.log(error);
                    }
                }
            };

            fetchHallAndSeats();
        }, [show, showId]);

        useEffect(() => {
            const fetchConcessions = async () => {
                try {
                    const token = Cookies.get("authToken");
                    if (token) {
                        const concessionsData = await getAllConcessions(token);
                        setConcessions(concessionsData);
                    }
                } catch (error) {
                    toast(error.message);
                }
            };

            fetchConcessions();
        }, [step]);

        const colIndexToChar = (index) => String.fromCharCode(65 + index);

        const selectDeselectSeat = (seat) => {
            if (seat.status !== "PENDING") {
                const isSelected = selectedSeats.some(s => s.rowIndex === seat.rowIndex && s.colIndex === seat.colIndex);
                setSelectedSeats(isSelected
                    ? selectedSeats.filter(s => !(s.rowIndex === seat.rowIndex && s.colIndex === seat.colIndex))
                    : [...selectedSeats, seat]);
            }
        };

        const handleConcessionChange = (concessionId, quantity) => {
            if (quantity >= 0 && quantity <= 10) {
                setSelectedConcessions(prev => ({
                    ...prev,
                    [concessionId]: quantity
                }));
            }
        };


        const generateSeatLayout = () => {
            if (!seats.length || !hall) return null;

            const seatsPerRow = hall.totalCol;

            return (
                <div>
                    {Array.from({ length: Math.ceil(seats.length / seatsPerRow) }).map((_, rowIndex) => (
                        <div className="seat-row" key={rowIndex}>
                            {seats.slice(rowIndex * seatsPerRow, (rowIndex + 1) * seatsPerRow).map((seat) => (
                                <span
                                    key={seat.id}
                                    className={
                                        seat.status === 'UNAVAILABLE' || seat.status === 'PENDING'
                                            ? 'seat-unavailable'
                                            : selectedSeats.some(s => s.rowIndex === seat.rowIndex && s.colIndex === seat.colIndex)
                                                ? 'seat-selected'
                                                : 'seat-available'
                                    }
                                    onClick={() => selectDeselectSeat(seat)}
                                >
                                    <div className="f">{colIndexToChar(seat.rowIndex)}{seat.colIndex + 1}</div>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            );
        };

        useEffect(() => {
            const calculateTotalPrice = () => {
                let basePrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);

                let concessionTotal = Object.entries(selectedConcessions).reduce((total, [concessionId, quantity]) => {
                    const concession = concessions.find(c => c.id === Number(concessionId));
                    return total + (concession.price * quantity);
                }, 0);

                setFinalPrice(basePrice + concessionTotal - discount);
            };

            calculateTotalPrice();
        }, [selectedSeats, selectedConcessions, concessions, discount]);

        const handleBooking = async () => {
            try {
                const token = Cookies.get('authToken');
                const seatIds = selectedSeats.map(seat => seat.seatId);
                const selectedConcessionsArray = Object.entries(selectedConcessions).map(([concessionId, quantity]) => ({
                    concessionId: Number(concessionId),
                    quantity
                }));

                const bookingData = {
                    seat_ids: seatIds,
                    show_id: showId,
                    concessions: selectedConcessionsArray,
                    paymentMethod: 'NET_BANKING',
                    finalPrice
                };

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
                    setQrCode(result.qrLink);
                    setBookingConfirmed(true);
                    toast.success('Booking Successful');
                } else {
                    console.error(result);
                    toast.error('Booking Failed');
                }
            } catch (error) {
                console.error('Error during booking:', error);
                toast.error('Booking Failed');
            }
        };

        useEffect(() => {
            if (bookingConfirmed) {
                navigate("/checkout/default");
            }
        }, [bookingConfirmed, navigate]);

        const handleNext = () => {
            setDirection('slide-left');
            setStep(2);
        };

        const handlePrevious = () => {
            setDirection('slide-right');
            setStep(1);
        };

        return (
            <div className='selectseatpage'>
                {movie && hall && (
                    <div className='s1'>
                        <div className='head'>
                            <h1>{movie.title} - {hall.name} - Suất chiếu lúc
                                : {new Date(show.startTime).toLocaleString('vi-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })}</h1>

                            <div className='genres-container'>
                                {movie.genres.map((genre, index) => (
                                    <h3 key={index} className='type'>{genre.genre}</h3>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <TransitionGroup>
                    {hall && step === 1 && (
                        <CSSTransition key="select-seat" timeout={0} classNames="">
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
                                        <p>Đã chọn</p>
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
                                            <br></br><br></br>
                                        </div>
                                        <div className='column2'>
                                            <h3>{selectedSeats.reduce((acc, seat) => acc + seat.price, 0)} đ</h3>
                                            <br></br>
                                            <button className='theme_btn1 linkstylenone' onClick={handleNext}>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CSSTransition>
                    )}

                    {step === 2 && (
                        <CSSTransition key="choose-concession" timeout={500} classNames={direction}>
                            <div className="concession">
                                <h2>Bắp Nước</h2>
                                <div className="concessions-container">
                                    {concessions.map((concession) => (
                                        <div key={concession.id} className="concession-item">
                                            <img src={concession.imageUrl} alt={concession.name}
                                                 className="concession-image"/>
                                            <div className="concession-details">
                                                <h3>{concession.name}</h3>
                                                <p>{concession.description}</p>
                                                <p>{concession.price.toLocaleString()} đ</p>
                                                <div className="concession-quantity">
                                                    <button
                                                        onClick={() => handleConcessionChange(concession.id, (selectedConcessions[concession.id] || 0) - 1)}
                                                        disabled={(selectedConcessions[concession.id] || 0) <= 0}>
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="10"
                                                        value={selectedConcessions[concession.id] || 0}
                                                        onChange={(e) => handleConcessionChange(concession.id, parseInt(e.target.value))}
                                                    />
                                                    <button
                                                        onClick={() => handleConcessionChange(concession.id, (selectedConcessions[concession.id] || 0) + 1)}
                                                        disabled={(selectedConcessions[concession.id] || 0) >= 10}>
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='totalcont1'>
                                    <div className='sum-area'>
                                        <h2>Tổng thanh toán</h2>
                                        <h4>{finalPrice.toLocaleString()} đ</h4>

                                        <button className='theme_btn1 linkstylenone' onClick={handleBooking}>Đặt vé
                                        </button>
                                    </div>
                                </div>
                                <div className="previous-button-container">
                                    <button className='theme_btn1 linkstylenone' onClick={handlePrevious}>Quay lại
                                    </button>
                                </div>

                            </div>

                        </CSSTransition>
                    )}
                </TransitionGroup>
            </div>
        );
    };

    export default SelectSeat;
