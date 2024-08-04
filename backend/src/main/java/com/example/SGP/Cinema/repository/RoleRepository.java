package com.example.SGP.Cinema.repository;

import com.example.SGP.Cinema.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RoleRepository extends JpaRepository<Role, Long>{
	Role findByName(String name);
}
