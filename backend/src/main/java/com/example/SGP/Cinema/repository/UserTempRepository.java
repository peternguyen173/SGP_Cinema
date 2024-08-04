package com.example.SGP.Cinema.repository;

import java.util.Optional;

import com.example.SGP.Cinema.entities.AccountTemp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
@Transactional
public interface UserTempRepository extends JpaRepository<AccountTemp, Long> {
	void deleteByUsername(String name);
	
	int countByIp(String ip);
	
	Optional<AccountTemp> findByCode(String code);
	
	Boolean existsByUsername(String username);
	Boolean existsByEmail(String email);
}
