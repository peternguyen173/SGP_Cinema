package com.example.SGP.Cinema.repository;

import java.util.Optional;

import com.example.SGP.Cinema.entities.JWTToken;
import org.springframework.data.jpa.repository.JpaRepository;


public interface JWTokenRepository extends JpaRepository<JWTToken, String> {
	
	Optional<JWTToken> findByUserId(String id);
	Optional<JWTToken> findByRefreshToken(String refresh_token);
}
