package com.example.SGP.Cinema.request;

import jakarta.validation.constraints.NotNull;

public class BookingConcessionRequest {

    @NotNull
    private Long concessionId;

    @NotNull
    private Integer quantity;

    // Getters and setters
    public Long getConcessionId() {
        return concessionId;
    }

    public void setConcessionId(Long concessionId) {
        this.concessionId = concessionId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
