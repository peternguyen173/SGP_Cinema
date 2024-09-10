import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getAllBookingsFromUser } from '../../../api/bookingApi';
import './BookingHistory.css';

const BookingHistory = () => {
    const [bookingData, setBookingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 6;

    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                const token = Cookies.get('authToken');
                const response = await getAllBookingsFromUser(token);
                setBookingData(response);
            } catch (error) {
                setError('Failed to fetch booking data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Calculate the index range for the current page
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = bookingData.slice(indexOfFirstTicket, indexOfLastTicket);

    // Determine the total number of pages
    const totalPages = Math.ceil(bookingData.length / ticketsPerPage);

    return (
        <div className="booking-history">
            <h1>Booking History</h1>
            {bookingData.length > 0 ? (
                <>
                    <div className="tickets-container">
                        {currentTickets.map((booking) => (
                            <div className="ticket" key={booking.id}>
                                <div className="ticket-header">
                                    <h2>{booking.movieTitle}</h2>
                                </div>
                                <div className="ticket-body">
                                    <p><strong>Date:</strong> {new Date(booking.c).toLocaleDateString()}</p>
                                    <p><strong>Time:</strong> {booking.time}</p>
                                    <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
                                    <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        <button
                            className="pagination-button"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="page-number">Page {currentPage} of {totalPages}</span>
                        <button
                            className="pagination-button"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p>No bookings found.</p>
            )}
        </div>
    );
};

export default BookingHistory;
