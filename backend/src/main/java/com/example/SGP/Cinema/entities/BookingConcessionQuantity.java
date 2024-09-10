package com.example.SGP.Cinema.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "BookingConcessionQuantity")
public class BookingConcessionQuantity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "concession_id", nullable = false)
    private Concession concession;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    public BookingConcessionQuantity() {}

    public BookingConcessionQuantity(Booking booking, Concession concession, int quantity) {
        this.booking = booking;
        this.concession = concession;
        this.quantity = quantity;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public Concession getConcession() {
        return concession;
    }

    public void setConcession(Concession concession) {
        this.concession = concession;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
