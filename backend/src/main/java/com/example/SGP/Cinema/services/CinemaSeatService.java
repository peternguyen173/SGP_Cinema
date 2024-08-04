package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.entities.CinemaHall;
import com.example.SGP.Cinema.request.SeatEditRequest;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.response.SeatsResponse;
import org.springframework.stereotype.Service;

import java.util.List;


public interface CinemaSeatService {
	
	List<SeatsResponse> getAllSeatsFromHall(String hallID);
	
	public void CreateListSeats(CinemaHall hall);
	public void RemoveAllSeatsFromHall(String hallID);
	
	public MyApiResponse Edit(String hallID, SeatEditRequest seatReq);
	
	public boolean isExist(String hallID, int row, int column);
}
