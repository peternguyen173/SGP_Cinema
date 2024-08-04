package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.request.BookingRequest;
import com.example.SGP.Cinema.response.BookingResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface BookingService {
	public BookingResponse createBooking(String username, BookingRequest bookingReq);
	public MyApiResponse cancleBooking(String username, String booking_id);
	
	public BookingResponse getBookingFromID(String username, String booking_id);
	public List<BookingResponse> listOfBooking(String username);
	
	public MyApiResponse setBookingStatus(String username, String booking_id, String status);
}
