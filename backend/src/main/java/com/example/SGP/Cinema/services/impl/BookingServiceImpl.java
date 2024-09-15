package com.example.SGP.Cinema.services.impl;

import java.util.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;

import com.example.SGP.Cinema.entities.*;
import com.example.SGP.Cinema.entities.enumModel.*;
import com.example.SGP.Cinema.exception.*;
import com.example.SGP.Cinema.repository.*;
import com.example.SGP.Cinema.request.BookingConcessionRequest;
import com.example.SGP.Cinema.request.BookingRequest;
import com.example.SGP.Cinema.request.PaymentRequest;
import com.example.SGP.Cinema.response.BookingResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.services.BookingService;
import com.example.SGP.Cinema.services.PaymentService;
import com.example.SGP.Cinema.services.UserService;
import com.example.SGP.Cinema.utils.VNPay;
import jakarta.persistence.LockModeType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;


@Service
public class BookingServiceImpl implements BookingService {
	
	final private int MAXSPAM = 10; // per user
	final private int MAX_TICKETS_PER_SHOW = 10; // for per user
	final private int TIMEOUT = 15; // in minutes
	final private long CHECK_PENDING_BOOKING_IS_TIMEOUT = 60000; // in miliseconds
	final private long CHECK_QUEUE_OF_SPAM_USERS = 30000; // in miliseconds
	private String qrLink = "https://img.vietqr.io/image/MB-7653145689999-compact2.png?amount={amount}&addInfo={addInfo}&accountName=NGUYEN%20DINH%20TUAN%20DUNG";

	Queue<Account> spamUsers = new LinkedList<>();
	
	@Autowired 
	private UserRepository userREPO;


	@Autowired
	private ShowSeatRepository showSeatREPO;
	
	@Autowired
	private CinemaShowRepository showREPO;

	@Autowired
	private UserService userSER;
	
	@Autowired
	private BookingRepository bookingREPO;

	@Autowired ConcessionRepository concessionREPO;
	
	@Autowired
	private PaymentRepository paymentREPO;
	
	@Autowired
	private SpamUserRepository spamREPO;
	
	@Autowired
	private PaymentService paymentSER;
	
	private boolean seatsAreFull(CinemaShow show) {
		int bookedSeat = showSeatREPO.countByShowIdAndStatus(show.getId(), ESeatStatus.AVAILABLE);
		return bookedSeat == 0;
	}

	private ShowSeat getSeatFromStatus(String seat_id, CinemaShow show, ESeatStatus status) {
		ShowSeat seat = showSeatREPO.findByIdAndShowId(seat_id, show.getId()).orElseThrow(() -> new MyNotFoundException("Not found seat id: " + seat_id));
		if (seat.getStatus().equals(status.name()))
			return seat;
		return null;
	}
	
	private void setStatusForBookingAndSeats(Booking booking, BookingStatus bookingStatus, ESeatStatus seatStatus) {
		booking.setStatus(bookingStatus);
		for (ShowSeat seat : booking.getSeats()) {
			seat.setStatus(seatStatus);
			showSeatREPO.save(seat);
		}
		
		bookingREPO.save(booking);
	}
	
	private void cancleBookingFromID(Booking booking) {
//		booking.setStatus(BookingStatus.CANCLED);
//		
//		for (ShowSeat seat : booking.getSeats()) {
//			seat.setStatus(ESeatStatus.AVAILABLE);
//			showSeatREPO.save(seat);
//		}
//		
//		bookingREPO.save(booking);
		this.setStatusForBookingAndSeats(booking, BookingStatus.CANCLED, ESeatStatus.AVAILABLE);
	}
	
//	private void restoreBooking(Booking booking) {
//		this.setStatusForBookingAndSeats(booking, BookingStatus.PENDING, ESeatStatus.PENDING);
//	}
	
	private String[] removeDuplicate(List<String> array) {
		Set<String> set = new HashSet<>(array);
		return set.toArray(new String[0]);
	}

	@Override
	public BookingResponse getLatestBooking(String username) {
		// Implement the logic to fetch the latest booking for the user
		// This could involve querying the database for the latest booking
		// by the username and returning the booking response
		Booking booking = bookingREPO.findFirstByUserUsernameOrderByCreateAtDesc(username);
		return booking != null ? new BookingResponse(booking) : null;
	}

	@Override
	public BookingResponse createBooking(String username, BookingRequest bookingReq) {
		if (bookingReq.getSeatsId().size() > 4)
			throw new MyBadRequestException("You can not reverse more than 4 seats at the time.");

		Account user = userREPO.getByUsername(username).orElseThrow(() -> new MyNotFoundException("User is not found"));
		if (user.getStatus().equals(UserStatus.BLACKLISTED.name()))
			throw new MyAccessDeniedException("You are not allowed to book ticket");

		CinemaShow show = showREPO.findById(bookingReq.getShowId()).orElseThrow(() -> new MyNotFoundException("Show is not found"));
		int total_tickets_of_user_from_show = bookingREPO.countByShowId(show.getId());
		if (total_tickets_of_user_from_show == this.MAX_TICKETS_PER_SHOW)
			throw new MyLockedException("You have already " + this.MAX_TICKETS_PER_SHOW + " tickets in this show, so you can pay no more tickets");
		if (this.seatsAreFull(show))
			throw new MyLockedException("Sorry, seats of this show are full. Please choose another show");

		List<ShowSeat> seats = new ArrayList<>();
		for (String seatId : this.removeDuplicate(bookingReq.getSeatsId())) {
			// Sử dụng Pessimistic Lock để khóa ghế ngay lập tức trong cơ sở dữ liệu
			ShowSeat seat = showSeatREPO.findByIdAndLock(seatId, show.getId())
					.orElseThrow(() -> new MyConflictExecption("Seat ID " + seatId + " is not found"));

			// Kiểm tra trạng thái ghế xem nó có sẵn không
			if (!(seat.getStatus().equals(ESeatStatus.AVAILABLE.name()))) {
				throw new MyConflictExecption("Seat ID " + seatId + " is already reserved.");
			}
		}

		Booking booking = new Booking(user, show, seats);
		// Sinh Qr code
		booking.setPaymentMethod(bookingReq.getPaymentMethod());
		if (booking.getPaymentMethod().equals(PaymentMethod.NET_BANKING.name())) {
			String qr = qrLink.replace("{amount}", bookingReq.getFinalPrice().toString());
			qr = qr.replace("{addInfo}", "Booking%20" + booking.getId());
			booking.setQrLink(qr);
		}
		booking.setStatus(BookingStatus.PENDING);
		booking.setPaymentStatus(PaymentStatus.PENDING);
		booking.setFinalPrice(bookingReq.getFinalPrice());
		for (BookingConcessionRequest concessionRequest : bookingReq.getConcessions()) {
			Concession concession = concessionREPO.findById(concessionRequest.getConcessionId())
					.orElseThrow(() -> new NotFoundException("Concession not found with id " + concessionRequest.getConcessionId()));
			BookingConcessionQuantity bookingConcession = new BookingConcessionQuantity(booking, concession, concessionRequest.getQuantity());
			booking.getBookingConcessions().add(bookingConcession);
		}
		Booking bookingSaved = bookingREPO.save(booking);
		return new BookingResponse(bookingSaved);
	}

	@Override
	public MyApiResponse updateBookingStatus(String bookingId, String username, BookingStatus bookingStatus, PaymentStatus paymentStatus) throws Exception {
		Booking booking = bookingREPO.findById(bookingId).orElseThrow(() -> new Exception("Booking not found"));

		if (!booking.getUser().getUsername().equals(username)) {
			throw new Exception("Unauthorized");
		}

		booking.setStatus(bookingStatus);
		booking.setPaymentStatus(paymentStatus);
		bookingREPO.save(booking);

		return new MyApiResponse("Booking status updated successfully");
	}


	@Override
	public MyApiResponse cancleBooking(String username, String booking_id) {
		Account user = userREPO.getByUsername(username).orElseThrow(() -> new MyNotFoundException("User is not found"));
		Booking booking = bookingREPO.findById(booking_id).orElseThrow(() -> new MyNotFoundException("Booking ticket is not found"));
		
		if (!user.getId().equals(booking.getUser().getId())) 
			throw new MyConflictExecption("This ticket does not belong to user " + user.getUsername());
		
		if (booking.getStatus().equals(BookingStatus.CANCLED) || booking.getStatus().equals(BookingStatus.BOOKED))
			throw new MyBadRequestException("This ticket can not be cancled");
		
		this.cancleBookingFromID(booking);
		return new MyApiResponse("Done");
	}
	
	@Override
	public List<BookingResponse> listOfBooking(String username) {
		Account user = userREPO.getByUsername(username).orElseThrow(() -> new MyNotFoundException("User is not found"));
		List<Booking> listBooking = bookingREPO.findAllByUserId(user.getId());
		
		List<BookingResponse> info = new ArrayList<>();
		for (Booking booking : listBooking) {
			info.add(new BookingResponse(booking));
		}
		return info;
	}
	
	@Override
	public BookingResponse getBookingFromID(String username, String booking_id) {
		Account user = userREPO.getByUsername(username).orElseThrow(() -> new MyNotFoundException("User is not found"));
		Booking booking = bookingREPO.findByIdAndUserId(booking_id, user.getId()).orElseThrow(() -> new MyNotFoundException("Ticket is not found"));
		return new BookingResponse(booking);
	}
	
	@Override
	public MyApiResponse setBookingStatus(String username, String booking_id, String status) {
		Account user = userREPO.getByUsername(username).orElseThrow(() -> new MyNotFoundException("User is not found"));
		Booking booking = bookingREPO.findByIdAndUserId(booking_id, user.getId()).orElseThrow(() -> new MyNotFoundException("Ticket is not found"));
		
		status = status.toUpperCase();
		if (booking.getStatus().name().equals(status))
			throw new MyBadRequestException("This ticket already have this status");
		
		switch (status) {
		case "PENDING":
			for (ShowSeat seat : booking.getSeats()) {
				seat.setStatus(ESeatStatus.AVAILABLE);
				showSeatREPO.save(seat);
			}
			bookingREPO.deleteById(booking_id);
			Booking newBooking = new Booking(booking);
			bookingREPO.save(newBooking);
			break;
			
		case "CANCLED":
			this.cancleBooking(username, booking_id);
			break;
			
		case "BOOKED":
			booking.setStatus(BookingStatus.BOOKED);
			PaymentRequest req = new PaymentRequest(booking_id, "");
			paymentSER.create(username, req, "127.0.0.1");
			break;
			
		default:
			throw new MyBadRequestException("Not found status " + status);
		}
		
		return new MyApiResponse("Success");
	}
	
	@Scheduled(fixedDelay = CHECK_PENDING_BOOKING_IS_TIMEOUT)
	public void autoCancleBooking() {
		//System.out.println("==> Check");
		List<Booking> bookingList = bookingREPO.findAllByStatus(BookingStatus.PENDING);
		
		LocalDateTime now = LocalDateTime.now();
		for (Booking booking : bookingList) {
			Date createDate = booking.getCreateAt();
			LocalDateTime toLocalDateTime = createDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
			Duration duration = Duration.between(toLocalDateTime, now);
			long minutes = duration.toMinutes() % 60;

			List<Payment> payments = paymentREPO.findAllByBookingId(booking.getId());
			Payment payment = null;
			boolean existPayment = false;
			if (payments.size() != 0) {
				payment = payments.get(0);
				existPayment = true;
			}
			
			if (minutes >= this.TIMEOUT || (existPayment && payment.getStatus() != PaymentStatus.PENDING )) {
				// Check Again when timeout and payment is
				if (minutes >= this.TIMEOUT && existPayment && payment.getStatus() == PaymentStatus.PENDING ) {
					try {
						Integer paid = VNPay.verifyPay(payment);
						if (paid == 0) {
							payment.setStatus(PaymentStatus.PAID);
							paymentREPO.save(payment);
						}
						else if (paid == 2) {
							payment.setStatus(PaymentStatus.CANCLED);
							paymentREPO.save(payment);
						}
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}	
				}

				if (existPayment && payment.getStatus() == PaymentStatus.PAID) {
					 booking.setStatus(BookingStatus.BOOKED);
					 bookingREPO.save(booking);
					
					 for (ShowSeat seat : booking.getSeats()) {
					 	seat.setStatus(ESeatStatus.BOOKED);
					 	showSeatREPO.save(seat);
					 }

					paymentSER.addPaymentMail(payment);
					System.out.println("--> Send ticket of booking " + booking.getId());
				}
				else {
					this.cancleBookingFromID(booking);
					this.spamUsers.offer(booking.getUser());
					System.out.println("--> Delete status of booking " + booking.getId());
				}
			}
		}
	}
	
	@Scheduled(fixedDelay = CHECK_QUEUE_OF_SPAM_USERS )
	public void blacklistUsers() {
		if (this.spamUsers.size() == 0)
			return;
		
		while (this.spamUsers.size() != 0) {
			Account user = this.spamUsers.poll();
			Optional<SpamUser> getSpam = spamREPO.findByUserId(user.getId());
			
			if (getSpam.isPresent()) {
				SpamUser spam = getSpam.get();
				int times = spam.increase();
				
				if (times >= this.MAXSPAM) {
					user.setStatus(UserStatus.BLACKLISTED);
					userSER.saveUser(user);
				}
				spamREPO.save(spam);
			}
			else {
				SpamUser spam = new SpamUser(user);
				spamREPO.save(spam);
			}
		}
	}
}



