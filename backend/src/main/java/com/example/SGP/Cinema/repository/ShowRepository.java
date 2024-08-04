package com.example.SGP.Cinema.repository;

import com.example.SGP.Cinema.entities.CinemaShow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ShowRepository extends JpaRepository<CinemaShow, String> {

}
