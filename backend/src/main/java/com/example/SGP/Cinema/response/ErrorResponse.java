package com.example.SGP.Cinema.response;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ErrorResponse extends MyApiResponse {
	
	@JsonProperty("status")
	private HttpStatus status;
	private String message;

	public ErrorResponse() {
		super("");
	}
	
	public ErrorResponse(String message) {

		super(message);
		this.message=message;
	}

	public ErrorResponse(String message, HttpStatus httpStatus) {
		super(message);
		this.status = httpStatus;
		this.message=message;
	}
}
