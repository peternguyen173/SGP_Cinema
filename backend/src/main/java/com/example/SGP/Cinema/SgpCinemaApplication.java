package com.example.SGP.Cinema;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class SgpCinemaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SgpCinemaApplication.class, args);
	}

}
