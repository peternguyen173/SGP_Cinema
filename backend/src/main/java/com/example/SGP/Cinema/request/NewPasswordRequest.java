package com.example.SGP.Cinema.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class NewPasswordRequest {
	
	@NotBlank
	@NotNull
	String password;
	
	public String getPassword() {
		return this.password;
	}
}
