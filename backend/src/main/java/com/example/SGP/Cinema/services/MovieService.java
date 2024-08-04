package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.entities.Movie;
import com.example.SGP.Cinema.response.MovieInfoResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import org.springframework.stereotype.Service;

import java.util.List;


public interface MovieService {
	
	List<MovieInfoResponse> getMovies(int pageNumber, int pageSize);
		
	Movie saveMovie (Movie movie);
	
	List<MovieInfoResponse> getMatchingName(String title, int pageNumber, int pageSize);
	
	Object[] getMatchingGenre(String genre, int pageNumber, int pageSize);
	
	MovieInfoResponse getMovie (Long id);

	MyApiResponse deleteMovie(Long id);
	
	Movie updateMovie (Movie movie);

	MyApiResponse saveMovieList(List<Movie> movies);

}
