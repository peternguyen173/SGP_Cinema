package com.example.SGP.Cinema.services.impl;

import java.util.List;
import java.util.ArrayList;

import com.example.SGP.Cinema.entities.CinemaHall;
import com.example.SGP.Cinema.entities.CinemaSeat;
import com.example.SGP.Cinema.entities.enumModel.ESeat;
import com.example.SGP.Cinema.entities.enumModel.ESeatStatus;
import com.example.SGP.Cinema.exception.MyNotFoundException;
import com.example.SGP.Cinema.repository.CinemaSeatRepository;
import com.example.SGP.Cinema.request.SeatEditRequest;
import com.example.SGP.Cinema.response.ErrorResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.response.SeatsResponse;
import com.example.SGP.Cinema.services.CinemaSeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CinemaSeatServiceImpl implements CinemaSeatService {
	
	@Autowired
	private CinemaSeatRepository hallSeatRepo;
	
	private ESeat getSeatType(String type) {
		if (type.equals(null))
			return null;
		
		type = type.toUpperCase();
		
		switch (type) {
		case "REGULAR":
			return ESeat.REGULAR;
		case "PREMIUM":
			return ESeat.PREMIUM;
		default:
			return null;
		}
	}
	
	private ESeatStatus getSeatStatus(String status) {
		if (status.equals(null))
			return null;
		
		status = status.toUpperCase();
		switch (status) {
		case "AVAILABLE":
			return ESeatStatus.AVAILABLE;
		case "UNAVAILABLE":
			return ESeatStatus.UNAVAILABLE;
		default:
			return null;
		}
	}

	@Override
	public void CreateListSeats(CinemaHall hall) {
		for (int r = 0; r < hall.getTotalRow(); r++)
			for (int c = 0; c < hall.getTotalCol(); c++) {
				CinemaSeat cinemaSeat = new CinemaSeat(hall, r, c, ESeat.REGULAR);
				hallSeatRepo.save(cinemaSeat);
			}	
	}

	@Override
	public boolean isExist(String hallID, int row, int column) {
		return hallSeatRepo.findByCinemaHallIdAndRowIndexAndColIndex(hallID, row, column).isPresent();
	}

	@Override
	public void RemoveAllSeatsFromHall(String hallID) {
		hallSeatRepo.deleteAllByCinemaHallId(hallID);
	}

	@Override
	public List<SeatsResponse> getAllSeatsFromHall(String hallID) {
		List<CinemaSeat> seats = hallSeatRepo.findByCinemaHallId(hallID);
		List<SeatsResponse> data = new ArrayList<>();
		
		for (CinemaSeat seat : seats) {
			SeatsResponse resp = new SeatsResponse(seat);
			data.add(resp);
		}
		
		return data;
	}

	@Override
	public MyApiResponse Edit(String hallID, SeatEditRequest seatReq) {
		System.out.println(seatReq.getRow() + " - " + seatReq.getCol());
		
		CinemaSeat cinemaSeat = hallSeatRepo.findByCinemaHallIdAndRowIndexAndColIndex(hallID, seatReq.getRow(), seatReq.getCol())
				.orElseThrow(() -> new MyNotFoundException("Seat not found"));
		
		ESeat type = this.getSeatType(seatReq.getType());
		if (type.equals(null))
			return new ErrorResponse("Type is not found. It must be REGULAR or PREMIUM");
		
		ESeatStatus status = this.getSeatStatus(seatReq.getStatus());
		if (status.equals(null))
			return new ErrorResponse("Status is not found. It must be AVAILABLE or UNAVAILABLE");
		
		cinemaSeat.setSeatType(type);
		cinemaSeat.setStatus(status);
		hallSeatRepo.save(cinemaSeat);
		return new MyApiResponse("Success");
	}
}
