package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.entities.Genre;
import com.example.SGP.Cinema.response.MyApiResponse;

import java.util.List;


public interface GenreService {
	
	List<Genre> getGenres();
	
	Genre saveGenre (Genre genre);
	
	MyApiResponse saveListGenres(List<Genre> genre);
	
	Genre getGenre (Long id);

	MyApiResponse deleteGenre (Long id);
	
	Genre updateGenre (Genre genre);

}

