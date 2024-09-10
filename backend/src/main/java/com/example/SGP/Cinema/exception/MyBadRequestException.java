package com.example.SGP.Cinema.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import com.example.SGP.Cinema.response.ErrorResponse;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class MyBadRequestException extends RuntimeException {

	private static final long serialVersionUID = 6547364028220081492L;
	private ErrorResponse error;

	public MyBadRequestException(ErrorResponse error) {
		super(error.getMessage());
		this.error = error;
	}

	public MyBadRequestException(String message) {
		super(message);
		this.error = new ErrorResponse(message, HttpStatus.BAD_REQUEST);
	}

	public MyBadRequestException(String message, Throwable cause) {
		super(message, cause);
		this.error = new ErrorResponse(message, HttpStatus.BAD_REQUEST);
	}

	public ErrorResponse getErrorResponse() {
		return this.error;
	}
}
