package com.example.SGP.Cinema.repository;

import java.util.List;

import com.example.SGP.Cinema.entities.Genre;
import org.springframework.data.jpa.repository.JpaRepository;


import jakarta.validation.constraints.NotBlank;

public interface GenreReposity extends JpaRepository<Genre, Long>{
	
	boolean existsByGenre(@NotBlank String genre);
	List<Genre> findAllByGenre(String genre);
	List<Genre> findByGenreContaining(String genre);
	Genre findByGenre(String genre);
}
