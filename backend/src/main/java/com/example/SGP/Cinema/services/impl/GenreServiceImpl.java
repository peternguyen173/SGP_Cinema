package com.example.SGP.Cinema.services.impl;

import java.util.ArrayList;
import java.util.List;

import com.example.SGP.Cinema.entities.Genre;
import com.example.SGP.Cinema.exception.MyBadRequestException;
import com.example.SGP.Cinema.exception.MyNotFoundException;
import com.example.SGP.Cinema.repository.GenreReposity;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.services.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class GenreServiceImpl implements GenreService {
	
	@Autowired
	private GenreReposity gReposity;
	
	@Override
	public List<Genre> getGenres() {
		return gReposity.findAll();
	}

	@Override
	public Genre saveGenre(Genre genre) {
		if (gReposity.existsByGenre(genre.getGenre())) {
			throw new MyBadRequestException("This genre is existed");
		}
		Genre saveGenre = gReposity.save(genre);
		return saveGenre;
	}
	
	@Override
	public MyApiResponse saveListGenres(List<Genre> genres) {
		List<Genre> saveGenres = new ArrayList<>();
		for (Genre g : genres) {
			if (gReposity.existsByGenre(g.getGenre())) {
				continue;
			}
			else {
				saveGenres.add(gReposity.save(g));
			}
		}
		return new MyApiResponse("Success");
	}

	@Override
	public Genre getGenre(Long id) {
		return gReposity.findById(id).orElseThrow(() -> new MyNotFoundException("Genre ID not found"));
	}

	@Override
	public MyApiResponse deleteGenre(Long id) {
		if (!gReposity.existsById(id))
			throw new MyNotFoundException("Genre ID " + id + " not found");
		gReposity.deleteById(id);
		return new MyApiResponse("Delete genre ID " + id);
	}

	@Override
	public Genre updateGenre(Genre genre) {
		
		if (!gReposity.existsById(genre.getId()))
			throw new MyNotFoundException("Genre ID not found");
		
		if (gReposity.existsByGenre(genre.getGenre()))
			throw new MyBadRequestException("Can update this name becasue another genre has this one");
			
		return gReposity.save(genre);
	}
}
