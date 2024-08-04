package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.request.ShowRequest;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.response.ShowInfoResponse;
import com.example.SGP.Cinema.response.ShowSeatResponse;
import org.springframework.stereotype.Service;

import java.util.List;



public interface CinemaShowService {
	public MyApiResponse addShow(ShowRequest show);
	public List<MyApiResponse> addListShows(List<ShowRequest> shows);
	public MyApiResponse deleteShow(String show_id);
	public MyApiResponse deleteShowByHallIDMovieID(ShowRequest showReq);
	public MyApiResponse updateShow(String show_id, ShowRequest showReq);
	
	public ShowInfoResponse getShowInfo(String show_id);
	public List<ShowInfoResponse> getAllShows();
	public List<ShowInfoResponse> getAllShowByHallID(String hallID);
	public List<ShowInfoResponse> getAllShowByMovieID(Long movieID);
	public List<ShowSeatResponse> getAllShowSeats(String showID);
}
