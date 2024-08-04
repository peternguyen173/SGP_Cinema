package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.entities.Payment;
import com.example.SGP.Cinema.request.HashRequest;
import com.example.SGP.Cinema.request.PaymentRequest;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.response.PaymentResponse;

import java.util.List;



public interface PaymentService {
	
	public PaymentResponse create(String username, PaymentRequest request, String ip_addr);
	public PaymentResponse getFromId(String username, String payment_id);
	public List<PaymentResponse> getAllPaymentsOfUser(String username);
	public boolean checkPaymentInfo(PaymentRequest request);
	public MyApiResponse verifyPayment(String username, String payment_id);
	
	public String createHash(HashRequest rawdata);
	public void addPaymentMail(Payment payment);

}
