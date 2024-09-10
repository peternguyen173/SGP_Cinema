// components/Checkout.js
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import "./Checkout.css"
import { getLastestBookingByUsername, updateBookingStatus } from '../../../api/bookingApi';
import tick from "../../../asset/tick.png"
import { Link } from "react-router-dom";
import {toast} from "react-toastify";
const Checkout = () => {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);


    useEffect(() => {
        // Fetch the latest booking
        const fetchLatestBooking = async () => {
            try {
                const token = Cookies.get('authToken');
                const latestBooking = await getLastestBookingByUsername(token);
                setBooking(latestBooking);
                setStatus(latestBooking.status);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLatestBooking();
    }, []);

    useEffect(() => console.log(booking), [booking]);

    if (!booking) {
        return <div>Loading...</div>;
    }

    const handlePayment = async (bookingId) => {
        setLoading(true);
        try {
            const token = Cookies.get('authToken');
            await updateBookingStatus(token, bookingId);
            toast.success('Payment processed successfully');
        } catch (error) {
            console.error('Payment processing failed', error);
            setError('Payment processing failed');
        } finally {
            setLoading(false);
        }
        setStatus("BOOKED")
    };

    return (
        <>
        {status === 'PENDING' &&
        <div className="ticket">
            <h1>Phim: {booking.movieName}</h1>
            <p>Phòng chiếu: {booking.hallName}</p>
            <p>Ghế: {booking.seats.join(', ')}</p>
            <div className="qr-code">
                <img src={booking.qrLink} alt="QR Code" className="qr-image" />
            </div>            <button onClick={() => handlePayment(booking.id)} disabled={loading}>
                {loading ? 'Processing...' : 'Thanh toán'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>}

    {status === "BOOKED" && <div className={'wrapper'}>
        <img className={"img"} src={tick}/>
        <h2>Cảm ơn bạn !</h2>
        <p>Bạn đã thanh toán thành công.</p>
        <br></br>
        <p> Mã vé của bạn là "{booking.id}". Vui lòng đưa mã số này đến quầy vé SGP Cinema để nhận vé của bạn!</p>
        <Link to="/">
            <button type="button">
                OK
            </button>
        </Link>
    </div>}
        </>

    )
}

export default Checkout;
