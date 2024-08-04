package com.example.SGP.Cinema.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.example.SGP.Cinema.response.ErrorResponse;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class MyBadRequestException extends RuntimeException {
	
	private static final long serialVersionUID = 6547364028220081492L;
	private ErrorResponse error;
	private String message;
	
	public MyBadRequestException(ErrorResponse error) {
		this.error = error;
	}
	
	public MyBadRequestException(String message, Throwable cause) {
		super(message, cause);
	}
	
	public MyBadRequestException(String message) {
		super(message);
		this.message = message;
	}
	
	public ErrorResponse getErrorResponse() {
		return this.error;
	}
	
	public void setErrorResponse(ErrorResponse error) {
		this.error = error;
	}
	
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
