package com.example.SGP.Cinema.services.impl;

import org.springframework.data.domain.Pageable;
import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.SGP.Cinema.exception.MyBadRequestException;
import com.example.SGP.Cinema.exception.MyNotFoundException;
import com.example.SGP.Cinema.entities.Movie;
import com.example.SGP.Cinema.entities.Genre;
import com.example.SGP.Cinema.repository.GenreReposity;
import com.example.SGP.Cinema.repository.MovieRepo;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.response.MovieInfoResponse;
import com.example.SGP.Cinema.security.InputValidationFilter;
import com.example.SGP.Cinema.services.MovieService;


@Service
public class MovieServiceImpl implements MovieService{
	
	@Autowired
	private MovieRepo mRepo;
	
	@Autowired
    private InputValidationFilter inputValidationSER;
	
	@Autowired
	private GenreReposity genreREPO;
	
	@Override
	public List<MovieInfoResponse> getMovies(int pageNumber, int pageSize){
		
		Pageable pages = PageRequest.of(pageNumber, pageSize);
		List<Movie> movies= mRepo.findAll(pages).getContent();
		List<MovieInfoResponse> movieInfoResponses = new ArrayList<>();
		for (Movie movie : movies) {
			movieInfoResponses.add(new MovieInfoResponse(movie));
		}
		return movieInfoResponses;
	}
	
	
	@Override
	public Movie saveMovie(Movie movie) {
		if (mRepo.existsByTitle(movie.getTitle()))
			throw new MyBadRequestException("This title is existed");
		
		Movie save = mRepo.save(movie);
		return save;
	}
	
	@Override
	public List<MovieInfoResponse> getMatchingName(String keyword, int pageNumber, int pageSize) {
		
		String key = inputValidationSER.sanitizeInput(keyword);
		
		if (!inputValidationSER.checkInput(key))
        	throw new MyBadRequestException("Data containt illegal character");
		
		Pageable pages = PageRequest.of(pageNumber, pageSize);
		List<Movie> movies = mRepo.findByTitleContaining(key,pages);
		List<MovieInfoResponse> movieInfoResponses = new ArrayList<>();
		for (Movie movie : movies) {
			movieInfoResponses.add(new MovieInfoResponse(movie));
		}
		return movieInfoResponses;
	}
	
	@Override
	public Object[] getMatchingGenre(String keyword, int pageNumber, int pageSize) {
		
		String key = inputValidationSER.sanitizeInput(keyword);
		if (!inputValidationSER.checkInput(key))
        	throw new MyBadRequestException("Data containt illegal character");
		
		
		List<Genre> genres = genreREPO.findByGenreContaining(key);
		if (genres.isEmpty())
			return new Object[0];
		
		List<MovieInfoResponse> movieInfoResponses = new ArrayList<>();
//		Pageable pages = PageRequest.of(pageNumber, pageSize);
//		List<Movie> movies = mRepo.findByGenresNameContainning(key, pages);
		for (Genre g : genres) {
			for (Movie movie : g.getMovies()) {
				movieInfoResponses.add(new MovieInfoResponse(movie));
			}
		}
		
		Set<MovieInfoResponse> movieSet = new HashSet<>(movieInfoResponses);
		MovieInfoResponse[] uniqueMovies = movieSet.toArray(new MovieInfoResponse[0]);
		return uniqueMovies;
	}

	@Override
	public MovieInfoResponse getMovie(Long id) {
		Movie m = mRepo.findById(id).orElseThrow(() -> new MyNotFoundException("Movie not found"));
		return new MovieInfoResponse(m);
	}

	@Override
	public MyApiResponse deleteMovie(Long id) {
		mRepo.findById(id).orElseThrow(() -> new MyNotFoundException("Movie not found"));
		mRepo.deleteById(id);
		return new MyApiResponse("Deleted moive ID " + id);
	}

	@Override
	public Movie updateMovie(Movie movie) {
		return mRepo.save(movie);
	}

	@Override
	public MyApiResponse saveMovieList(List<Movie> movies) {
		for (Movie m : movies) {
			if (mRepo.existsByTitle(m.getTitle())) {
				continue;
			}
			
			Set<String> genreSet = new HashSet<>();
			for (Genre genre : m.getGenres()) {
			   genreSet.add(genre.getGenre());
			}
			
			m.setGenres(new ArrayList<>());
			for (String genre : genreSet) {
			   Genre g = genreREPO.findByGenre(genre);	
			   if (g == null) {
			      g = new Genre();
			      genreREPO.save(g);
			   }
			   m.getGenres().add(g);
			}
			mRepo.save(m);			
		}
		
		return new MyApiResponse("Success");
	}
}
