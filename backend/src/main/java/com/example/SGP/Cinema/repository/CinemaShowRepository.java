package com.example.SGP.Cinema.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.example.SGP.Cinema.entities.CinemaShow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface CinemaShowRepository extends JpaRepository<CinemaShow, String> {
	 @Query(value = "SELECT s FROM CinemaShow s WHERE ((:startTime >= s.startTime AND :startTime <= s.endTime) OR (:endTime >= s.startTime AND :endTime <= s.endTime)) AND s.cinemaHall.id = :hallID")
	 List<CinemaShow> findConflictingShows(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime, @Param("hallID") String hallID);
	 
	 List<CinemaShow> findByCinemaHallId(String hallId);
	 List<CinemaShow> findByMovieId(Long movieId);
	 
	 @Query(value = "SELECT s FROM CinemaShow s WHERE s.cinemaHall.id = :hallId AND s.movie.id = :movieId AND s.startTime = :startTime")
	 CinemaShow findByHallIdAndMovieId(@Param("hallId") String hallId, @Param("movieId") Long movieId, @Param("startTime") LocalDateTime startTime);
}
