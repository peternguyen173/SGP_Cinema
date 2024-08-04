package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.entities.CinemaHall;
import com.example.SGP.Cinema.request.CinemaHallRequest;
import com.example.SGP.Cinema.response.MyApiResponse;
import org.springframework.stereotype.Service;

import java.util.List;


public interface CinemaHallService {
	List<CinemaHall> getAllHalls();
	CinemaHall getHallById(String id);
	
	MyApiResponse newHall(CinemaHall c);
	MyApiResponse editHall(String hallID, CinemaHallRequest c);
	MyApiResponse removeHall(String HallID);
	
	boolean isExistByName(String hallName);
	boolean isExistById(String ID);
}
