package com.example.SGP.Cinema.services.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Queue;
import java.util.stream.Collectors;

import com.example.SGP.Cinema.entities.Account;
import com.example.SGP.Cinema.entities.AccountTemp;
import com.example.SGP.Cinema.entities.JWTToken;
import com.example.SGP.Cinema.entities.enumModel.ERole;
import com.example.SGP.Cinema.exception.MyAccessDeniedException;
import com.example.SGP.Cinema.exception.MyBadRequestException;
import com.example.SGP.Cinema.repository.UserTempRepository;
import com.example.SGP.Cinema.request.LoginRequest;
import com.example.SGP.Cinema.request.SignUpRequest;
import com.example.SGP.Cinema.response.AuthenJWTokenResponse;
import com.example.SGP.Cinema.response.AuthenticationResponse;
import com.example.SGP.Cinema.response.EmailResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.security.InputValidationFilter;
import com.example.SGP.Cinema.services.*;
import com.example.SGP.Cinema.utils.RandomStringGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

	final private int length = 50;

	@Value("${app.redirectURL}")
	private String redirectURL;

	@Value("${app.base_verified_url}")
	private String base_verified_url;

	@Autowired
	private UserService userSER;

	@Autowired
	private InputValidationFilter inputValidationSER;

	@Autowired
	private UserTempRepository userTmpREPO;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private EmailService emailSER;

	private static final Logger logger = LoggerFactory.getLogger(AuthenticationServiceImpl.class);

	@Autowired
	private JWTokenService jwtTokenSER;

	private Queue<EmailResponse> mailQueue = new LinkedList<>();

	private List<String> createTokens(String rawIP, Account user, AuthenJWTokenResponse data, boolean isUpdate) {
		Collection<String> ip = new ArrayList<String>();
		ip.add(rawIP);
		Map<String, Collection<?>> ip_addr = new HashMap<>();
		ip_addr.put("ip_addr", ip);

		Map<String, Collection<?>> list_roles = new HashMap<>();
		list_roles.put("roles", user.getAuthorities());
		//logListRoles(list_roles);

		String accessToken = jwtService.generateToken(list_roles, user);
		String refreshToken = jwtService.generateRefreshToken(ip_addr, user);
		JWTToken save = null;

		if (!isUpdate) {
			save = jwtTokenSER.saveInfo(user, accessToken, refreshToken);
		} else {
			save = jwtTokenSER.updateInfo(data.getData(), accessToken, refreshToken);
		}

		List<String> tokens = new ArrayList<>();
		tokens.add(accessToken);
		tokens.add(save.getRefreshToken());
		return tokens;
	}
//	private void logListRoles(Map<String, Collection<?>> list_roles) {
//		list_roles.forEach((key, value) -> {
//			String roles = value.stream()
//					.map(Object::toString)
//					.collect(Collectors.joining(", "));
//			logger.info("Key: {}, Roles: {}", key, roles);
//		});
//	}
	@Override
	public MyApiResponse signup(SignUpRequest request, String client_ip) {

		String username = inputValidationSER.sanitizeInput(request.getUsername()).toLowerCase();
		String password = inputValidationSER.sanitizeInput(request.getPassword());
		String email = inputValidationSER.sanitizeInput(request.getEmail()).toLowerCase();
		String fullname = inputValidationSER.sanitizeInput(request.getFullname());

		if (!inputValidationSER.checkInput(username + " " + password + " " + email + " " + fullname))
			throw new MyBadRequestException("Data containt illegal character");
		if (userSER.UsernameIsExisted(username) || userTmpREPO.existsByUsername(username))
			throw new MyBadRequestException("Username is existed or Waiting for verifying email");
		if (userSER.EmailIsExisted(email) || userTmpREPO.existsByEmail(email))
			throw new MyBadRequestException("Email is existed or Waiting for verifying email");
		if (!userSER.PasswordIsGood(password))
			throw new MyBadRequestException("Password is so bad");

		String code = RandomStringGenerator.generate(length);
		AccountTemp userTMP = new AccountTemp(null,
				fullname,
				username, passwordEncoder.encode(password),
				request.getPhone(), request.getAddress(),
				email, code, client_ip);

		userTmpREPO.save(userTMP);
		this.mailQueue.offer(new EmailResponse(email,
				"Movie-Project verify your email",
				"This is a link to verify your account. Please, do not share it to anyone:\n" +
						this.base_verified_url + code));
		return new MyApiResponse("Please, go to your email to verify your account", HttpStatus.OK);
	}

	@Override
	public AuthenticationResponse login(LoginRequest request, HttpServletRequest servletRequest, boolean adminLogin) {
		// System.out.println("====> " + request.getUsername());

		String username = inputValidationSER.sanitizeInput(request.getUsername());
		String password = request.getPassword();

		if (!inputValidationSER.checkInput(username + " " + password))
			throw new MyBadRequestException("Data containt illegal character");

		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(username, password));
		} catch (BadCredentialsException e) {
			throw new MyAccessDeniedException("Username or password is wrong1");
		}

		Account user = userSER.getRawUserByUsername(username);

		if (adminLogin) {
			if (!userSER.userHaveRole(user, ERole.ROLE_ADMIN))
				throw new UsernameNotFoundException("User not found");
		}

		AuthenJWTokenResponse data = jwtTokenSER.getData(user);

		String accessToken = null;
		String refreshToken = null;

		if (data == null) {
			List<String> tokens = this.createTokens(servletRequest.getRemoteAddr(), user, data, false);
			accessToken = tokens.get(0);
			refreshToken = tokens.get(1);
		} else if (!jwtService.isValidToken(data.getRefreshDecrypt(), user, false)) {
			List<String> tokens = this.createTokens(servletRequest.getRemoteAddr(), user, data, true);
			accessToken = tokens.get(0);
			refreshToken = tokens.get(1);
		} else if (!jwtService.isValidToken(data.getAccessDecrypt(), user, true)) {
			accessToken = jwtService.generateTokenFromRefreshToken(data.getRefreshDecrypt());
			jwtTokenSER.setAccessToken(data.getData(), accessToken);
			refreshToken = data.getData().getRefreshToken();
		} else {
			accessToken = data.getAccessDecrypt();
			refreshToken = data.getData().getRefreshToken();
		}
		return new AuthenticationResponse(accessToken, refreshToken, username, user.getEmail());
	}

	@Override
	public void veriyCode(String code, HttpServletResponse response) {
		Optional<AccountTemp> acountTMP = userTmpREPO.findByCode(code);
		if (!acountTMP.isPresent()) {
			response.setHeader("Location", this.redirectURL + "/404");
			response.setStatus(302);
			return;
		}

		Account user = new Account(acountTMP.get());

		userSER.saveUser(user);
		userSER.addRoleToUser(user.getUsername(), ERole.ROLE_USER);

		userTmpREPO.deleteByUsername(user.getUsername());
		response.setHeader("Location", this.redirectURL + "/auth/siginin");
		response.setStatus(302);
	}

	@Override
	public AuthenticationResponse refreshAccessToken(String refreshToken, HttpServletRequest servletRequest) {
		AuthenJWTokenResponse data = jwtTokenSER.getFromRefreshToken(refreshToken);
		Account user = data.getData().getUser();

		if (jwtService.isValidToken(data.getAccessDecrypt(), user, true))
			return new AuthenticationResponse(data.getAccessDecrypt(), data.getData().getRefreshToken(), "", "");

		if (!jwtService.isValidToken(data.getRefreshDecrypt(), user, false))
			throw new MyAccessDeniedException("Refresh token is invalid");

		String accessToken = jwtService.generateTokenFromRefreshToken(data.getRefreshDecrypt());
		jwtTokenSER.setAccessToken(data.getData(), accessToken);
		return new AuthenticationResponse(accessToken, data.getData().getRefreshToken(), "", "");
	}

	@Scheduled(fixedDelay = 1)
	public void sendVerifyMail() {
		while (this.mailQueue.size() != 0) {
			EmailResponse data = this.mailQueue.poll();
			System.out.println("Sending to mail " + data.getMail());
			emailSER.sendMail(data.getMail(), data.getSubject(), data.getContent());
			System.out.println("=====> Done");
		}
	}
}
