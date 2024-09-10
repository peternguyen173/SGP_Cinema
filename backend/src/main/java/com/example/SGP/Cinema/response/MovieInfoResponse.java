package com.example.SGP.Cinema.response;

import com.example.SGP.Cinema.entities.Comment;
import com.example.SGP.Cinema.entities.Genre;
import com.example.SGP.Cinema.entities.Movie;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;


public class MovieInfoResponse {
	private Long id;
	private String title;
	private String description;
	private int durationInMins;
	private String language;
	private String releaseDate;
	private String country;
	private byte[] image;
	private byte[] large_image;
	private String trailer;
	private List<String> actors;
	private List<String> genres;
	private List<CommentResponse> comments;

	public MovieInfoResponse(Movie m) {
		this.id = m.getId();
		this.title = m.getTitle();
		this.description = m.getDescription();
		this.language = m.getLanguage();
		this.releaseDate = m.getReleaseDate();
		this.country = m.getCountry();
		this.trailer = m.getTrailer();
		this.actors = m.getActors();
		this.image = m.getImage();
		this.large_image = m.getLargeImage();
		this.genres = m.getGenres2();
		this.durationInMins = m.getDurationInMins();
		this.comments = this.convertType(m.getComments());
	}

	public MovieInfoResponse(Long id, String title, byte[] image, byte[] large_image, List<String> genre, int durationInMins, List<Comment> comment) {
		this.id = id;
		this.title = title;
		this.image = image;
		this.large_image = large_image;
		this.genres = genre;
		this.durationInMins = durationInMins;
		this.comments = this.convertType(comment);
	}

	public Long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return this.description;
	}

	public String getLanguage() {
		return this.language;
	}

	public String getreleaseDate() {
		return this.releaseDate;
	}

	public String getCountry() {
		return this.country;
	}

	public String getTrailer() {
		return this.trailer;
	}

	public List<String> getActors() {
		return this.actors;
	}

	public byte[] getImage() {
		return this.image;
	}

	public byte[] getLargeImage() {
		return this.large_image;
	}

	public List<String> getGenres() {
		return this.genres;
	}

	public int getDurationInMins() {
		return durationInMins;
	}

	public List<CommentResponse> getComments() {
		return this.comments;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}

	public void setLargeImage(byte[] image) {
		this.large_image = image;
	}

	public void setGenre(List<String> genre) {
		this.genres = genre;
	}


	public void setDurationInMins(int durationInMins) {
		this.durationInMins = durationInMins;
	}

	private List<CommentResponse> convertType(List<Comment> comments) {
		List<CommentResponse> data = new ArrayList<CommentResponse>();
		for (Comment c : comments)
			data.add(new CommentResponse(c));
		return data;
	}

}
