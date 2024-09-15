package com.example.SGP.Cinema.repository;

import java.util.List;
import java.util.Optional;

import com.example.SGP.Cinema.entities.ShowSeat;
import com.example.SGP.Cinema.entities.enumModel.ESeatStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

	// Tìm kiếm ghế với ID và khóa bi quan
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT s FROM ShowSeat s WHERE s.id = :seatId AND s.show.id = :showId")
	Optional<ShowSeat> findByIdAndLock(@Param("seatId") String seatId,
									   @Param("showId") String showId);
}

