package com.example.SGP.Cinema.response;


import com.example.SGP.Cinema.entities.CinemaSeat;
import com.example.SGP.Cinema.entities.enumModel.ESeatStatus;

public class SeatsResponse {

	private Long id;
	private String name;
	private int rowIndex;
	private int colIndex;
	private String type;
	private ESeatStatus status;
	private double price;
	
	public SeatsResponse(CinemaSeat s) {
		this.id = s.getId();
		this.name = s.getName();
		this.rowIndex = s.getRowIndex();
		this.colIndex = s.getColIndex();
		this.type = s.getSeatType();
		this.status = s.getStatus();
		this.price = s.getPrice();
	}
	
	public String getName() {
		return this.name;
	}

	public int getRowIndex() {
		return this.rowIndex;
	}

	public int getColIndex() {return this.colIndex;}

	public String getType() {
		return this.type;
	}
	
	public String getStatus() {
		return this.status.name();
	}

	public Long getId() {
		return id;
	}

	public double getPrice() {
		return this.price;
	}
}
