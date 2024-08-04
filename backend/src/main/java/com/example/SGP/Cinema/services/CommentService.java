package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.request.AddCommentRequest;
import com.example.SGP.Cinema.request.EditCommentRequest;
import com.example.SGP.Cinema.response.CommentResponse;
import com.example.SGP.Cinema.response.MyApiResponse;

import java.util.List;



public interface CommentService {
	public CommentResponse addComment(String username, AddCommentRequest req);
	public CommentResponse addListComments(String username, List<AddCommentRequest> req);
	public CommentResponse editComment(String username, String comment_id, EditCommentRequest req);
	
	public MyApiResponse addLike(String username, long movie_id);
	public MyApiResponse addDisLike(String username, long movie_id);
	
	public MyApiResponse deleteCommentByUsername(String username, String comment_id);
	public MyApiResponse deleteCommentById(String comment_id);
	
	public CommentResponse getOne(String username, String comment_id);
	public List<CommentResponse> getAllComments();
	public List<CommentResponse> getAllCommentsFromMovieId(long movie_id);
	public List<CommentResponse> getAllCommentsFromUserId(String user_id);
	public List<CommentResponse> getAllCommentsFromusername(String username);
}
