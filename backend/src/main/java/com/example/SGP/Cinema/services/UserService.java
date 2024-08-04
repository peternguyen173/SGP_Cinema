package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.entities.Account;
import com.example.SGP.Cinema.entities.Role;
import com.example.SGP.Cinema.entities.enumModel.ERole;
import com.example.SGP.Cinema.response.AccountSummaryResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;


public interface UserService extends UserDetailsService {
	Account saveUser(Account account);
	Role saveRole(Role role);
	
	Account getRawUserByUsername(String username);
	AccountSummaryResponse getUserByUsername(String username);
	AccountSummaryResponse getUserByEmail(String email);
	
	void addRoleToUser(String username, ERole role);
	void removeRoleUser(String username, ERole role);
	List<AccountSummaryResponse> getUsers();
	Boolean UsernameIsExisted(String name);
	Boolean EmailIsExisted(String email);
	Boolean PasswordIsGood(String password);
	
	@Override
	UserDetails loadUserByUsername(String username);
	
	AccountSummaryResponse getUserByName(String name);
	List<AccountSummaryResponse> searchByName(String username);
	void deteleUserByUsername(String username);
	Collection<Role> getRoleFromUser(String username);
	
	boolean userHaveRole(String username, ERole role);
	boolean userHaveRole(Account user, ERole role);
	
	MyApiResponse getURIforgetPassword(String email) throws Exception;
	MyApiResponse checkReocveryCode(String code);
	MyApiResponse setNewPassword(String code, String password);
	
	int countAccFromIP(String client_ip);

}
