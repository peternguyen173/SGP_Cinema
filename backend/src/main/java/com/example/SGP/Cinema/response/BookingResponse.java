package com.example.SGP.Cinema.response;

import com.example.SGP.Cinema.entities.Booking;

import java.util.List;


public class BookingResponse {
	
	private String id;
	private String showId;
	private String fullname;
	private double price;
	private List<String> seats;
	private String movieName;
	private String hallName;
	private String startTime;
	private String qrLink;
	private String create_at;
	private String status;
	
	public BookingResponse(Booking booking) {
		this.id = booking.getId();
		this.showId = booking.getShow().getId().toString();
		this.fullname = booking.getUser().getFullname();
		this.price = booking.getPriceFromListSeats();
		this.seats = booking.getNameOfSeats();
		this.movieName = booking.getShow().getMovie().getTitle();
		this.hallName = booking.getShow().getCinemaHall().getName();
		this.startTime = booking.getShow().getStartTime().toString();
		this.qrLink = booking.getQrLink();
		this.create_at = booking.getShow().getCreateAt().toString();
		this.status = booking.getStatus().name();

	}
	
	public String getId() {
		return this.id;
	}

	public String getShowId() {
		return this.showId;
	}
	
	public String getFullname() {
		return this.fullname;
	}
	
	public double getPrice() {
		return this.price;
	}
	
	public List<String> getSeats() {
		return this.seats;
	}
	
	public String getMovieName() {
		return this.movieName;
	}
	
	public String getHallName() {
		return this.hallName;
	}
	
	public String getStartTime() {
		return this.startTime;
	}

	public String getQrLink() {
		return this.qrLink;
	}

	public String getCreateAt() {
		return this.create_at;
	}
	
	public String getStatus() {
		return this.status;
	}
	
//	private List<String> getNameOfSeats(List<ShowSeat> seats) {
//		List<String> names = new ArrayList<>();
//		for (ShowSeat seat : seats)
//			names.add(seat.getCinemaSeat().getName());
//		return names;
//	}
	
//	private double getPriceFromListSeats(List<ShowSeat> seats) {
//		double res = 0;
//		for (ShowSeat seat : seats)
//			res += seat.getCinemaSeat().getPrice();
//		return res;
//	}
} 



