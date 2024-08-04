	package com.example.SGP.Cinema.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookingRequest {
	
	@JsonProperty(value = "seat_ids")
	@NotNull
	List<Long> seat_ids;

	@JsonProperty(value = "show_id")
	@NotNull
	@NotBlank
	String show_id;

	String paymentMethod;

	Long finalPrice;

	public List<Long> getSeatsId() {
		return this.seat_ids;
	}

	public String getShowId() {
		return this.show_id;
	}

	public String getPaymentMethod() {return this.paymentMethod;}
	public Long getFinalPrice() {return this.finalPrice;}
}
