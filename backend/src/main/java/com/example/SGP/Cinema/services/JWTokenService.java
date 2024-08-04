package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.entities.Account;
import com.example.SGP.Cinema.entities.JWTToken;
import com.example.SGP.Cinema.response.AuthenJWTokenResponse;
import org.springframework.stereotype.Service;


public interface JWTokenService {
	
	public AuthenJWTokenResponse getFromRefreshToken(String refresh_token);
	public AuthenJWTokenResponse getData(Account user);
	public JWTToken saveInfo(Account user, String accessToken, String refreshToken);
	public JWTToken updateInfo(JWTToken data, String accessToken, String refreshToken);
	public String getAccessToken(Account user);
	public String getRefreshToken(Account user);
	public String setAccessToken(JWTToken data, String accessToken);
	public String setRefreshToken(JWTToken data, String refreshToken);
}
