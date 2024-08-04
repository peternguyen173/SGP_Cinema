package com.example.SGP.Cinema.repository;

import java.util.List;
import java.util.Optional;

import com.example.SGP.Cinema.entities.ShowSeat;
import com.example.SGP.Cinema.entities.enumModel.ESeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Transactional
@Repository
public interface ShowSeatRepository extends JpaRepository<ShowSeat, String> {
	int countByShowIdAndStatus(String show_id, ESeatStatus status);
	List<ShowSeat> findByShowId(String showId);
	void deleteAllByShowId(String show_id);
	Optional<ShowSeat> findByIdAndShowId(String id, String showId);
	Optional<ShowSeat> findByCinemaSeatIdAndShowId(Long id, String showId);
}

