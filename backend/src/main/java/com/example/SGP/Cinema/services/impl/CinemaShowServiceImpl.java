package com.example.SGP.Cinema.services.impl;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.ArrayList;

import com.example.SGP.Cinema.entities.*;
import com.example.SGP.Cinema.entities.enumModel.ESeatStatus;
import com.example.SGP.Cinema.exception.MyBadRequestException;
import com.example.SGP.Cinema.exception.MyConflictExecption;
import com.example.SGP.Cinema.exception.MyNotFoundException;
import com.example.SGP.Cinema.repository.*;
import com.example.SGP.Cinema.request.ShowRequest;
import com.example.SGP.Cinema.response.ErrorResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.response.ShowInfoResponse;
import com.example.SGP.Cinema.response.ShowSeatResponse;
import com.example.SGP.Cinema.services.CinemaShowService;
import com.example.SGP.Cinema.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;



@Service
public class CinemaShowServiceImpl implements CinemaShowService {
	
	@Autowired
	CinemaHallRepository hallREPO;
	
	@Autowired
	private MovieRepo movieREPO;
	
	@Autowired
	private CinemaShowRepository showREPO;
	
	@Autowired
	private CinemaSeatRepository hallSeatRepo;
	
	@Autowired
	private ShowSeatRepository showSeatREPO;
	
	private List<ShowInfoResponse> convertToListShowInfo(List<CinemaShow> shows) {
		List<ShowInfoResponse> showsinfo = new ArrayList<>();
		for (CinemaShow show : shows) {
			int total_available_seats = showSeatREPO.countByShowIdAndStatus(show.getId(), ESeatStatus.AVAILABLE);
			int total_reserved_seats = showSeatREPO.countByShowIdAndStatus(show.getId(), ESeatStatus.BOOKED);
			ShowInfoResponse info = new ShowInfoResponse(show, total_reserved_seats, total_available_seats);
			showsinfo.add(info);
		}
		return showsinfo;
	}
	
	private void addNewShowSeats(String cinema_id, CinemaShow show, boolean delete_old) {
		List<CinemaSeat> cinemaSeats = hallSeatRepo.findByCinemaHallId(cinema_id);
		
		if (delete_old) {
			showSeatREPO.deleteAllByShowId(show.getId());
		}
			
		for (CinemaSeat cinemaSeat : cinemaSeats) {
            ShowSeat showSeat = new ShowSeat(show, cinemaSeat, ESeatStatus.AVAILABLE);
            showSeatREPO.save(showSeat);
        }
	}
	
	private void updateNewMovie(CinemaShow show, Long movie_id) {
		Movie movie = movieREPO.findById(movie_id).orElseThrow(() -> new MyNotFoundException("Movie is not found"));
		show.setMovie(movie);
		showREPO.save(show);
	}
	
	private void updateNewStartTime(CinemaShow show, LocalDateTime starttime) {
		LocalDateTime endtime = starttime.plusMinutes(show.getMovie().getDurationInMins()).plusMinutes(10);
		List<CinemaShow> conflictedShows = showREPO.findConflictingShows(starttime, endtime, show.getCinemaHall().getId());
		
		if (conflictedShows.size() != 0)
			throw new MyConflictExecption("Conflict start/end time with show ID: " + conflictedShows.get(0).getId());
		show.setStartTime(starttime);
		show.setEndTime(endtime);
		showREPO.save(show);
	}
	
	private CinemaShow updateNewHall(CinemaShow show, String hall_id) {
		CinemaHall hall = hallREPO.findById(hall_id).orElseThrow(() -> new MyNotFoundException("Hall is not found"));
		this.addNewShowSeats(hall.getId(), show, true);
		show.setCinemaHall(hall);
		return showREPO.save(show);
	}
	
	private String addOneShow(ShowRequest showReq) {
		CinemaHall hall = hallREPO.findById(showReq.getCinemaId()).orElseThrow(() -> new MyNotFoundException("Hall is not found"));
		Movie movie = movieREPO.findById(showReq.getMovieId()).orElseThrow(() -> new MyNotFoundException("Movie is not found"));
		
		LocalDateTime starttime = DateUtils.convertStringDateToDate(showReq.getStartTime(), "dd/MM/yyyy HH:mm");
		if (starttime == null)
			throw new MyBadRequestException("Invaild date format, it must be dd/MM/yyyy HH:mm");
		LocalDateTime endtime = starttime.plusMinutes(movie.getDurationInMins()).plusMinutes(10);
		// List<CinemaShow> conflictedShows = showREPO.findConflictingShows(starttime, endtime, hall.getId());
		// if (conflictedShows.size() != 0)
		// 	throw new MyConflictExecption("Conflict start/end time with show ID: " + conflictedShows.get(0).getId());
		
		CinemaShow show = new CinemaShow(hall, movie, starttime, endtime);
		CinemaShow saveShow = showREPO.save(show);
		this.addNewShowSeats(showReq.getCinemaId(), saveShow, false);
		return saveShow.getId();
	}

	@Override
	public MyApiResponse addShow(ShowRequest showReq) {
		return new MyApiResponse(this.addOneShow(showReq));
	}
	
	@Override
	public List<MyApiResponse> addListShows(List<ShowRequest> shows) {
		List<MyApiResponse> data = new ArrayList<MyApiResponse>();
		for (ShowRequest req : shows) {
			String show_id = this.addOneShow(req);
			data.add(new MyApiResponse(show_id));
		}
		return data;
	}

	@Override
	public ShowInfoResponse getShowInfo(String show_id) {
		CinemaShow show = showREPO.findById(show_id).orElseThrow(() -> new MyNotFoundException("Show is not found"));
		int total_available_seats = showSeatREPO.countByShowIdAndStatus(show.getId(), ESeatStatus.AVAILABLE);
		int total_reserved_seats = showSeatREPO.countByShowIdAndStatus(show.getId(), ESeatStatus.BOOKED);
		
		ShowInfoResponse info = new ShowInfoResponse(show, total_reserved_seats, total_available_seats);
		return info;
	}

	@Override
	public List<ShowInfoResponse> getAllShows() {
		List<CinemaShow> shows = showREPO.findAll();

		List<ShowInfoResponse> data = new ArrayList<ShowInfoResponse>();
		for (CinemaShow s : shows) 
			data.add(new ShowInfoResponse(s, 0, 0));
		return data;
	}

	@Override
	public List<ShowInfoResponse> getAllShowByHallID(String hallID) {
		List<CinemaShow> shows = showREPO.findByCinemaHallId(hallID);
		return this.convertToListShowInfo(shows);
	}
	
	@Override
	public List<ShowInfoResponse> getAllShowByMovieID(Long movieID) {
		List<CinemaShow> shows = showREPO.findByMovieId(movieID);
		return this.convertToListShowInfo(shows);
	}

	@Override
	public List<ShowSeatResponse> getAllShowSeats(String showID) {
		List<ShowSeatResponse> seatsInfo = new ArrayList<>();

		List<ShowSeat> seats = showSeatREPO.findByShowId(showID);
		// Sort seats by rowIndex and then by colIndex
		for (ShowSeat seat : seats) {
			ShowSeatResponse info = new ShowSeatResponse(seat);
			seatsInfo.add(info);
		}
		return seatsInfo;
	}

	@Override
	public MyApiResponse deleteShow(String show_id) {
		if (!showREPO.existsById(show_id))
			return new ErrorResponse("Show is found", HttpStatus.NOT_FOUND);
		
		showSeatREPO.deleteAllByShowId(show_id);
		showREPO.deleteById(show_id);
		return new MyApiResponse("Done");
	}
	
	@Override
	public MyApiResponse deleteShowByHallIDMovieID(ShowRequest showReq) {
		
		LocalDateTime start_time = DateUtils.convertStringDateToDate(showReq.getStartTime(), "dd/MM/yyyy HH:mm");
		if (start_time == null)
			throw new MyBadRequestException("Invaild date format, it must be dd/MM/yyyy HH:mm");
		
		CinemaShow cinemaShow = showREPO.findByHallIdAndMovieId(showReq.getCinemaId(), showReq.getMovieId(), start_time);
		showSeatREPO.deleteAllByShowId(cinemaShow.getId());
		showREPO.deleteById(cinemaShow.getId());
		
		return new MyApiResponse("Deleted");
	}

	@Override
	public MyApiResponse updateShow(String show_id, ShowRequest showReq) {
		CinemaShow show = showREPO.findById(show_id).orElseThrow(() -> new MyNotFoundException("Show is not found"));
		
		if (show.getMovie().getId() != showReq.getMovieId()) {
			this.updateNewMovie(show, showReq.getMovieId());
//			System.out.println("===> Update movie");
		}
		
		if (!show.getCinemaHall().getId().equals(showReq.getCinemaId())) {
			show = this.updateNewHall(show, showReq.getCinemaId());
//			System.out.println("===> Update hall");
		}
			
		LocalDateTime starttime = DateUtils.convertStringDateToDate(showReq.getStartTime(), "dd/MM/yyyy HH:mm");
		if (starttime != null && starttime.equals(show.getStartTime()))
		{
			this.updateNewStartTime(show, starttime);
//			System.out.println("===> Update time");
		}
		return new MyApiResponse("Done");
	}
	
}
