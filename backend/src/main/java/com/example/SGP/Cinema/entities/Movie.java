package com.example.SGP.Cinema.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.example.SGP.Cinema.request.MovieRequest;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "Movie",
	uniqueConstraints = { @UniqueConstraint(columnNames = { "title" ,"id"})
	})
public class Movie{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@CreationTimestamp
	@Column(name = "CreatedAt", updatable = false)
	private Date createdAt;
	
	@UpdateTimestamp
	@Column(name = "lastUpdated")
	private Date lastUpdated;
	
	@Column(name = "title")
	private String title;
	
	@Column(name = "description", length = 3000)
	private String description;
	
	@Column(name = "durationInMins")
	private int durationInMins;
	
	@Column(name = "language")
	private String language;
	
	@Column(name = "releaseDate")
	private String releaseDate;
	
	@Column(name = "country")
	private String country;

	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinTable(name = "Movie_Genre",
			joinColumns = {
					@JoinColumn(name = "movie_id", referencedColumnName = "id")

			},
			inverseJoinColumns = {
					@JoinColumn(name = "genre_id", referencedColumnName = "id")
			}
	)
	@JsonProperty(value = "genres")
	private List<Genre> genres;
	
	@OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

	@Lob
	@Column(name = "image")
	private byte[] image;

	@Lob
	@Column(name = "large_image")
	private byte[] large_image;
	
	@Column(name = "trailer")
	private String trailer;

	@ElementCollection
	@CollectionTable(name = "movie_actors", joinColumns = @JoinColumn(name = "movie_id"))
	@Column(name = "actor")
	private List<String> actors = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "movie_genres", joinColumns = @JoinColumn(name = "movie_id"))
	@Column(name = "genre")
	private List<String> genres2 = new ArrayList<>();


	public byte[] getLarge_image() {
		return large_image;
	}

	public void setLarge_image(byte[] large_image) {
		this.large_image = large_image;
	}

	public List<String> getGenres2() {
		return genres2;
	}

	public void setGenres2(List<String> genres2) {
		this.genres2 = genres2;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Movie() {}
	
	public Movie(MovieRequest req) {
		this.title = req.getTitle();
		this.description = req.getDescription();
		this.durationInMins = req.getDurationInMins();
		this.language = req.getLanguage();
		this.releaseDate = req.getReleaseDate();
		this.country = req.getCountry();
		this.image = req.getImage();
		this.large_image = req.getLargeImage();
	}
	
	public String getTrailer() {
		return trailer;
	}
	
	public void setTrailer(String trailer) {
		this.trailer = trailer;
	}
	
	public List<String> getActors() {
		return actors;
	}
	public void setActors(List<String> actors) {
		this.actors = actors;
	}

	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getTitle() {
		return title;
	}
	


	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public int getDurationInMins() {
		return durationInMins;
	}
	
	public void setDurationInMins(int durationInMins) {
		this.durationInMins = durationInMins;
	}
	
	public String getLanguage() {
		return language;
	}
	
	public void setLanguage(String language) {
		this.language = language;
	}
	
	public String getReleaseDate() {
		return releaseDate;
	}
	
	public void setReleaseDate(String releaseDate) {
		this.releaseDate = releaseDate;
	}
	
	public String getCountry() {
		return country;
	}
	
	public void setCountry(String country) {
		this.country = country;
	}
	
	public List<Genre> getGenres() {
		return genres;
	}
	
	public void setGenres(List<Genre> genre) {
		this.genres = genre;
	}
	
	public byte[] getImage() {
		return image;
	}
	
	public void setImage(byte[] image) {
		this.image = image;
	}

	public byte[] getLargeImage() {
		return this.large_image;
	}
	
	public void setLargeImage(byte[] image) {
		this.large_image = image;
	}
	
	public List<Comment> getComments() {
		return this.comments;
	}
	
	public void setComments(List<Comment> c) {
		this.comments = c;
	}
	
	public void addComment(Comment comment) {
        this.comments.add(comment);
    }

    public void removeComment(Comment comment) {
        this.comments.remove(comment);
    }
}
