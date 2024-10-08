package com.example.SGP.Cinema.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import com.example.SGP.Cinema.entities.Account;
import com.example.SGP.Cinema.entities.Booking;
import com.example.SGP.Cinema.entities.Comment;
import com.example.SGP.Cinema.entities.Movie;
import com.example.SGP.Cinema.entities.enumModel.BookingStatus;
import com.example.SGP.Cinema.exception.MyBadRequestException;
import com.example.SGP.Cinema.exception.MyNotFoundException;
import com.example.SGP.Cinema.repository.BookingRepository;
import com.example.SGP.Cinema.repository.CommentRepository;
import com.example.SGP.Cinema.repository.MovieRepo;
import com.example.SGP.Cinema.repository.UserRepository;
import com.example.SGP.Cinema.request.AddCommentRequest;
import com.example.SGP.Cinema.request.EditCommentRequest;
import com.example.SGP.Cinema.response.CommentResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class CommentServiceImpl implements CommentService {

	@Autowired
	private InputValidationServiceImpl validService;

	@Autowired
	private MovieRepo movieRepo;

	@Autowired
	private BookingRepository bookingRepo;

	@Autowired
	private CommentRepository commentRepo;

	@Autowired
	private UserRepository userRepo;

	private void deleteComment(Comment comment) {
		Movie m = comment.getMovie();
		m.removeComment(comment);
		movieRepo.save(m);

		commentRepo.delete(comment);
	}

	@Override
	public CommentResponse addComment(String username, AddCommentRequest req) {
		Account user = userRepo.getByUsername(username).orElseThrow(() -> new MyNotFoundException("User not found"));
		Movie movie = movieRepo.findById(req.getMovieId())
				.orElseThrow(() -> new MyNotFoundException("Movie not found"));

		Optional<Booking> booking = bookingRepo.findByUserIdAndMovieIdAndStatus(user.getId(), movie.getId(),
				BookingStatus.BOOKED);
		if (!booking.isPresent())
			throw new MyBadRequestException("You must buy ticket for this movie before reviewing.");

		if (commentRepo.existsByUserIdAndMovieId(user.getId(), movie.getId()))
			throw new MyBadRequestException("You already have reviewed this movie");

		if (req.getRatedStars() > 5 || req.getRatedStars() < 0)
			throw new MyBadRequestException("Rating number must be in range 0 and 5");

		String valid_comment = req.getComment(); // validService.sanitizeInput(req.getComment());
		Comment comment = new Comment(movie, user, req.getRatedStars(), valid_comment);

		Comment save = commentRepo.save(comment);
		movie.addComment(comment);
		movieRepo.save(movie);
		return new CommentResponse(save);
	}

	@Override
	public CommentResponse addListComments(String username, List<AddCommentRequest> req) {
		for (AddCommentRequest r : req) {
			this.addComment(username, r);
		}
		return new CommentResponse();
	}

	@Override
	public CommentResponse editComment(String username, String comment_id, EditCommentRequest req) {
		Comment comment = commentRepo.findById(comment_id)
				.orElseThrow(() -> new MyNotFoundException("Comment not found"));

		if (!comment.getUser().getUsername().equals(username))
			throw new MyBadRequestException("This comment is not belonged to you");

		String valid_comment = validService.sanitizeInput(req.getComment());
		comment.setComment(valid_comment);

		if (req.getRatingStars() != comment.getRated()) {
			if (req.getRatingStars() > 5 || req.getRatingStars() < 0)
				throw new MyBadRequestException("Rating number must be in range 0 and 5");
			comment.setRated(req.getRatingStars());
		}

		Comment save = commentRepo.save(comment);
		return new CommentResponse(save);
	}

	@Override
	public MyApiResponse addLike(String username, long movie_id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public MyApiResponse addDisLike(String username, long movie_id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public MyApiResponse deleteCommentById(String comment_id) {
		Comment comment = commentRepo.findById(comment_id)
				.orElseThrow(() -> new MyNotFoundException("Comment not found"));
		this.deleteComment(comment);
		return new MyApiResponse("Done");
	}

	@Override
	public MyApiResponse deleteCommentByUsername(String username, String comment_id) {
		Comment comment = commentRepo.findById(comment_id)
				.orElseThrow(() -> new MyNotFoundException("Comment not found"));

		if (!comment.getUser().getUsername().equals(username))
			throw new MyBadRequestException("This comment is not belonged to you");

		this.deleteComment(comment);
		return new MyApiResponse("Done");
	}

	@Override
	public CommentResponse getOne(String username, String comment_id) {
		Comment comment = commentRepo.findById(comment_id)
				.orElseThrow(() -> new MyNotFoundException("Comment not found"));

		if (!comment.getUser().getUsername().equals(username))
			throw new MyBadRequestException("This comment is not belonged to you");

		return new CommentResponse(comment);
	}

	@Override
	public List<CommentResponse> getAllComments() {
		List<Comment> list_coms = commentRepo.findAll();

		List<CommentResponse> data = new ArrayList<CommentResponse>();
		for (Comment c : list_coms)
			data.add(new CommentResponse(c));

		return data;
	}

	@Override
	public List<CommentResponse> getAllCommentsFromMovieId(long movie_id) {
		List<Comment> list_coms = commentRepo.findAllByMovieId(movie_id);

		List<CommentResponse> data = new ArrayList<CommentResponse>();
		for (Comment c : list_coms)
			data.add(new CommentResponse(c));
		return data;
	}

	@Override
	public List<CommentResponse> getAllCommentsFromUserId(String user_id) {
		List<Comment> list_coms = commentRepo.findAllByUserId(user_id);
		List<CommentResponse> data = new ArrayList<CommentResponse>();
		for (Comment c : list_coms)
			data.add(new CommentResponse(c));
		return data;
	}

	@Override
	public List<CommentResponse> getAllCommentsFromusername(String username) {
		Account user = userRepo.getByUsername(username).orElseThrow(() -> new MyNotFoundException("User not found"));
		return this.getAllCommentsFromUserId(user.getId());
	}

}
