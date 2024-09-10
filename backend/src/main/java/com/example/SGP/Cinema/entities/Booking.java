package com.example.SGP.Cinema.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.example.SGP.Cinema.entities.enumModel.BookingStatus;
import com.example.SGP.Cinema.entities.enumModel.PaymentStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "Booking")
public class Booking {

	@Id
	@GeneratedValue(generator = "custom-uuid")
	@GenericGenerator(name = "custom-uuid", strategy = "com.example.SGP.Cinema.utils.CustomUUIDGenerator")
	@Column(name = "id", unique = true, nullable = false, length = 26, insertable = false)
	private String id;

	@ManyToOne
	@NotNull
	private Account user;

	@ManyToOne
	@NotNull
	private CinemaShow show;


	@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<BookingConcessionQuantity> bookingConcessions = new ArrayList<>();

	@CreationTimestamp
	@Column(name = "create_at", nullable = false, updatable = false)
	private Date createAt;

	@UpdateTimestamp
	@Column(name = "update_at", nullable = true, updatable = true)
	private Date updateAt;

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private BookingStatus status;

	@ManyToMany(fetch = FetchType.EAGER)
	private List<ShowSeat> seats;

	@Column(name = "final_price")
	private Long finalPrice;

	@Column(name = "qr_link")
	private String qrLink;

	@Column(name = "payment_status")
	private PaymentStatus paymentStatus;

	@Column(name = "payment_method")
	private String paymentMethod;

	public Booking() {}

	public Booking(Booking booking) {
		this.user = booking.getUser();
		this.show = booking.getShow();
		this.seats = booking.getSeats();
		this.status = BookingStatus.PENDING;
	}

	public Booking(Account user, CinemaShow show, List<ShowSeat> seats) {
		this.user = user;
		this.show = show;
		this.seats = seats;
		this.status = BookingStatus.PENDING;
	}

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Account getUser() {
		return this.user;
	}

	public void setUser(Account user) {
		this.user = user;
	}

	public CinemaShow getShow() {
		return this.show;
	}

	public void setShow(CinemaShow show) {
		this.show = show;
	}

	public BookingStatus getStatus() {
		return this.status;
	}

	public void setStatus(BookingStatus status) {
		this.status = status;
	}

	public Date getCreateAt() {
		return this.createAt;
	}

	public Date getUpdateAt() {
		return this.updateAt;
	}

	public List<ShowSeat> getSeats() {
		return this.seats;
	}

	public void setSeats(List<ShowSeat> seats) {
		this.seats = seats;
	}

	public void addSeat(ShowSeat seat) {
		this.seats.add(seat);
	}

	public void removeSeat(ShowSeat seat) {
		this.seats.remove(seat);
	}

	public boolean isEmptySeats() {
		return this.seats.isEmpty();
	}

	public String getQrLink() {
		return qrLink;
	}

	public Long getFinalPrice() {
		return finalPrice;
	}

	public void setFinalPrice(Long finalPrice) {
		this.finalPrice = finalPrice;
	}

	public void setQrLink(String qrLink) {
		this.qrLink = qrLink;
	}

	public List<BookingConcessionQuantity> getBookingConcessions() {
		return bookingConcessions;
	}

	public void setBookingConcessions(List<BookingConcessionQuantity> bookingConcessions) {
		this.bookingConcessions = bookingConcessions;
	}

	public PaymentStatus getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(PaymentStatus paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public List<String> getNameOfSeats() {
		List<String> names = new ArrayList<>();
		for (ShowSeat seat : this.seats)
			names.add(seat.getCinemaSeat().getName());
		return names;
	}

	public double getPriceFromListSeats() {
		double res = 0;
		for (ShowSeat seat : this.seats)
			res += seat.getCinemaSeat().getPrice();
		return res;
	}
}