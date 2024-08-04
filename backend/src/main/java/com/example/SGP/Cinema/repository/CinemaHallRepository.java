package com.example.SGP.Cinema.repository;

import java.util.Optional;

import com.example.SGP.Cinema.entities.CinemaHall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CinemaHallRepository extends JpaRepository<CinemaHall, String> {
	Optional<CinemaHall> findByName(String name);
	
	boolean existsByName(String name);
}
