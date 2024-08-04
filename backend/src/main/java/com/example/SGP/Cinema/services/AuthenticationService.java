package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.request.LoginRequest;
import com.example.SGP.Cinema.request.SignUpRequest;
import com.example.SGP.Cinema.response.AuthenticationResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;


public interface AuthenticationService {
	public MyApiResponse signup(SignUpRequest request, String ip);
	public AuthenticationResponse login(LoginRequest request, HttpServletRequest servletRequest, boolean adminLogin);
	public AuthenticationResponse refreshAccessToken(String refreshToken, HttpServletRequest servletRequest);
	public void veriyCode(String code, HttpServletResponse response);
}