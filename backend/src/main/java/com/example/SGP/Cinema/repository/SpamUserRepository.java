package com.example.SGP.Cinema.repository;

import java.util.Optional;

import com.example.SGP.Cinema.entities.SpamUser;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SpamUserRepository extends JpaRepository<SpamUser, String> {
	Optional<SpamUser> findByUserId(String user_id);
	Boolean existsByUserId(String user_id);
}
