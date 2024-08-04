package com.example.SGP.Cinema.services.impl;

import com.example.SGP.Cinema.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailServiceImpl implements EmailService {

	private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

	@Value("${app.default_sender}")
	private String default_sender;

	@Autowired
	private JavaMailSender mailSender;

	@Override
	public void sendMail(String toMail, String subject, String body) {
		try {
			logger.info("Đang gửi email tới: {}", toMail);

			SimpleMailMessage mail = new SimpleMailMessage();
			mail.setFrom(default_sender);
			mail.setTo(toMail);
			mail.setSubject(subject);
			mail.setText(body);

			mailSender.send(mail);
			logger.info("Email đã được gửi thành công tới: {}", toMail);
		} catch (Exception e) {
			logger.error("Lỗi khi gửi email tới: {}", toMail, e);
		}
	}
}
