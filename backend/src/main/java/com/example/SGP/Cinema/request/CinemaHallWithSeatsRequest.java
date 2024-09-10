package com.example.SGP.Cinema.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CinemaHallWithSeatsRequest {

    @NotBlank
    private String name;

    @NotNull
    private int totalRow;

    @NotNull
    private int totalCol;

    @NotNull
    private List<SeatEditRequest> seats;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTotalRow() {
        return totalRow;
    }

    public void setTotalRow(int totalRow) {
        this.totalRow = totalRow;
    }

    public int getTotalCol() {
        return totalCol;
    }

    public void setTotalCol(int totalCol) {
        this.totalCol = totalCol;
    }

    public List<SeatEditRequest> getSeats() {
        return seats;
    }

    public void setSeats(List<SeatEditRequest> seats) {
        this.seats = seats;
    }
}
