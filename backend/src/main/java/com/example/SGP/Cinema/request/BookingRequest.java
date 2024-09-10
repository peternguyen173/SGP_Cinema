package com.example.SGP.Cinema.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookingRequest {

	@JsonProperty(value = "seat_ids")
	@NotNull
	private List<String> seat_ids;

	@JsonProperty(value = "show_id")
	@NotNull
	@NotBlank
	private String show_id;

	@JsonProperty(value = "concessions")
	@NotNull
	private List<BookingConcessionRequest> concessions;

	private String paymentMethod;

	private Long finalPrice;

	// Getters and setters
	public List<String> getSeatsId() {
		return this.seat_ids;
	}

	public void setSeatsId(List<String> seat_ids) {
		this.seat_ids = seat_ids;
	}

	public String getShowId() {
		return this.show_id;
	}

	public void setShowId(String show_id) {
		this.show_id = show_id;
	}

	public List<BookingConcessionRequest> getConcessions() {
		return concessions;
	}

	public void setConcessions(List<BookingConcessionRequest> concessions) {
		this.concessions = concessions;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public Long getFinalPrice() {
		return finalPrice;
	}

	public void setFinalPrice(Long finalPrice) {
		this.finalPrice = finalPrice;
	}
}
