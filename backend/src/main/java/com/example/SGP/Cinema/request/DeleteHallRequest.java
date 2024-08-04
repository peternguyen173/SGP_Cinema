package com.example.SGP.Cinema.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DeleteHallRequest {
	
	@NotBlank
	@NotNull
	private String name;
	
	public String getName() {
		return this.name;
	}
}
