package com.example.SGP.Cinema.repository;

import java.util.List;
import java.util.Optional;

import com.example.SGP.Cinema.entities.CinemaHall;
import com.example.SGP.Cinema.entities.CinemaSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CinemaSeatRepository extends JpaRepository<CinemaSeat, Long> {
	List<CinemaSeat> findByCinemaHall(CinemaHall hall);
	List<CinemaSeat> findByCinemaHallId(String hallID);
	
	Optional<CinemaSeat> findByCinemaHallIdAndRowIndexAndColIndex(String hallID, int row, int col);
	void deleteAllByCinemaHallId(String hallID);
}
