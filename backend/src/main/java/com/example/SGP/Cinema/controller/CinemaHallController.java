package com.example.SGP.Cinema.controller;

import com.example.SGP.Cinema.entities.CinemaSeat;
import com.example.SGP.Cinema.entities.enumModel.ESeat;
import com.example.SGP.Cinema.entities.enumModel.ESeatStatus;
import com.example.SGP.Cinema.repository.CinemaHallRepository;
import com.example.SGP.Cinema.request.CinemaHallWithSeatsRequest;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.SGP.Cinema.entities.CinemaHall;
import com.example.SGP.Cinema.request.CinemaHallRequest;
import com.example.SGP.Cinema.request.SeatEditRequest;
import com.example.SGP.Cinema.services.CinemaHallService;
import com.example.SGP.Cinema.services.CinemaSeatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import com.example.SGP.Cinema.response.ErrorResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.response.SeatsResponse;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/hall")
@Tag(name = "3. Cinema Hall Endpoint")
public class CinemaHallController {

	@Autowired
	CinemaHallRepository hallRepository;

	@Autowired
	private CinemaHallService hallSER;

	@Autowired
	private CinemaSeatService hallSeatSER;


	@PostMapping
	public ResponseEntity<?> createHallWithSeats(
			@Valid @RequestBody CinemaHallWithSeatsRequest request) {
		try {
			// Create Cinema Hall
			CinemaHall hall = new CinemaHall();
			hall.setName(request.getName());
			hall.setTotalRow(request.getTotalRow());
			hall.setTotalCol(request.getTotalCol());

			// Validate Cinema Hall
			if (hallSER.isExistByName(hall.getName())) {
				return ResponseEntity.badRequest().body(new ErrorResponse("This hall already exists", HttpStatus.BAD_REQUEST));
			}
			if (hall.getTotalCol() < 5 || hall.getTotalRow() < 5) {
				return ResponseEntity.badRequest().body(new ErrorResponse("Row/Column number must be greater than 5", HttpStatus.BAD_REQUEST));
			}

			hallSER.newHall(hall);

			// Create Seats
			List<SeatEditRequest> seatRequests = request.getSeats();
			for (SeatEditRequest seatRequest : seatRequests) {
				CinemaSeat seat = new CinemaSeat();
				seat.setCinemaHall(hall);
				seat.setRowIndex(seatRequest.getRow());
				seat.setColIndex(seatRequest.getCol());
				seat.setSeatType(ESeat.valueOf(seatRequest.getType()));
				seat.setStatus(ESeatStatus.valueOf(seatRequest.getStatus()));
				hallSeatSER.saveSeat(seat);
			}

			return ResponseEntity.ok(new MyApiResponse("Success"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse("An error occurred while creating the hall and seats: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
		}
	}

	@GetMapping("/{hall_id}")
	@Operation(summary = "Get Hall By ID Information (Admin is required)", responses = {
			@ApiResponse(responseCode = "200", description = "Hall's information.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CinemaHall.class))),
			@ApiResponse(responseCode = "404", description = "Hall is not found.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
	}, parameters = {
			@Parameter(name = "Authorication", in = ParameterIn.HEADER, schema = @Schema(type = "string"), example = "Bearer <token>", required = true)
	})
	@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
	public ResponseEntity<?> getbyID(@Valid @PathVariable(value = "hall_id") String hall_id) {
		return ResponseEntity.ok().body(hallSER.getHallById(hall_id));
	}

	@GetMapping("/byname/{name}")
	@Operation(summary = "Get Hall by Name", responses = {
			@ApiResponse(responseCode = "200", description = "Successfully retrieved the hall.", content = @Content(mediaType = "application/json"))
	})
	public ResponseEntity<?> getHallByName(@PathVariable String name) {

		Optional<CinemaHall> hall = hallRepository.findByName(name);  // Assume you have a repository that finds a hall by its name
		if (hall.isPresent()) {
			return ResponseEntity.ok(hall.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hall not found");
		}
	}


	@GetMapping("/getall")
	@Operation(summary = "Getall Hall Service (User is required)", responses = {
			@ApiResponse(responseCode = "200", description = "List Hall's information.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CinemaHall.class))),
	}, parameters = {
			@Parameter(name = "Authorication", in = ParameterIn.HEADER, schema = @Schema(type = "string"), example = "Bearer <token>", required = true)
	})
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> getAll() {
		return ResponseEntity.ok().body(hallSER.getAllHalls());
	}



	@PutMapping("/new")
	@Operation(summary = "Add a New Hall Service (Admin is required)", responses = {
			@ApiResponse(responseCode = "200", description = "Add a new hall successfully.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MyApiResponse.class))),
			@ApiResponse(responseCode = "400", description = "This hall is existed or Illegal characters in name or Row/Column number must be greater than 5.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
	}, parameters = {
			@Parameter(name = "Authorication", in = ParameterIn.HEADER, schema = @Schema(type = "string"), example = "Bearer <token>", required = true)
	}

	)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getall(@Valid @RequestBody CinemaHallRequest cReq) {
		CinemaHall hall = new CinemaHall(cReq);
		return ResponseEntity.ok().body(hallSER.newHall(hall));
	}

	@PostMapping("/{hallId}/seats")
	public ResponseEntity<String> addSeatsToHall(
			@PathVariable String hallId,
			@RequestBody List<SeatEditRequest> seatEditRequests) {
		try {
			CinemaHall hall = hallSER.getHallById(hallId);
			if (hall == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body("Cinema Hall not found");
			}

			for (SeatEditRequest request : seatEditRequests) {
				CinemaSeat seat = new CinemaSeat(hall, request.getRow(), request.getCol(), ESeat.valueOf(request.getType()));
				seat.setStatus(ESeatStatus.valueOf(request.getStatus()));
				hallSeatSER.saveSeat(seat);
			}

			return ResponseEntity.ok("Seats added successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while adding seats: " + e.getMessage());
		}
	}

	@DeleteMapping("/{hall_id}/delete")
	@Operation(summary = "Delete Hall Service (Admin is required)", responses = {
			@ApiResponse(responseCode = "200", description = "Delete Hall successfully.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MyApiResponse.class))),
			@ApiResponse(responseCode = "404", description = "Hall is not found.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
	}, parameters = {
			@Parameter(name = "Authorication", in = ParameterIn.HEADER, schema = @Schema(type = "string"), example = "Bearer <token>", required = true)
	}

	)
	@Transactional
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> test1(@PathVariable(value = "hall_id") String hall_id) {
		return ResponseEntity.ok().body(hallSER.removeHall(hall_id));
	}

	@PutMapping("/{hall_id}/edit")
	@Operation(summary = "Edit Hall Service (Admin is required)", responses = {
			@ApiResponse(responseCode = "200", description = "Edit hall successfully.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MyApiResponse.class))),
			@ApiResponse(responseCode = "400", description = "Illeagal charaters in name.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
			@ApiResponse(responseCode = "404", description = "Hall is not found.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
	}, parameters = {
			@Parameter(name = "Authorication", in = ParameterIn.HEADER, schema = @Schema(type = "string"), example = "Bearer <token>", required = true)
	})
	@Transactional
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> edit(@PathVariable(value = "hall_id") String hall_id,
			@RequestBody CinemaHallRequest cReq) {
		return ResponseEntity.ok().body(hallSER.editHall(hall_id, cReq));
	}

	@GetMapping("/{hall_id}/seat/getall")
	@Operation(summary = "Get All Seat In Hall (Admin is required)", responses = {
			@ApiResponse(responseCode = "200", description = "Seat's in hall information.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = SeatsResponse.class))),
	}, parameters = {
			@Parameter(name = "Authorication", in = ParameterIn.HEADER, schema = @Schema(type = "string"), example = "Bearer <token>", required = true)
	})
	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	public ResponseEntity<?> geAllSeatstbyHallID(@PathVariable(value = "hall_id") String hall_id) {
		return ResponseEntity.ok().body(hallSeatSER.getAllSeatsFromHall(hall_id));
	}

	@PutMapping("/{hall_id}/seat/edit")
	@Operation(summary = "Edit Seat In Hall Service (Admin is required)", responses = {
			@ApiResponse(responseCode = "200", description = "Edit seat in hall successfully.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MyApiResponse.class))),
			@ApiResponse(responseCode = "404", description = "Seat not found or Type is not found or Status is not found.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
	}, parameters = {
			@Parameter(name = "Authorication", in = ParameterIn.HEADER, schema = @Schema(type = "string"), example = "Bearer <token>", required = true)
	}

	)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getall(@PathVariable(value = "hall_id") String hall_id,
			@RequestBody SeatEditRequest cReq) {
		return ResponseEntity.ok().body(hallSeatSER.Edit(hall_id, cReq));
	}

	@PutMapping("/{hall_id}/seats/edit")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> updateSeats(
			@PathVariable(value = "hall_id") String hallId,
			@RequestBody List<SeatEditRequest> seatEditRequests) {
		try {
			// Fetch the cinema hall by ID
			CinemaHall hall = hallSER.getHallById(hallId);
			if (hall == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(new ErrorResponse("Cinema Hall not found", HttpStatus.NOT_FOUND));
			}

			// Fetch all existing seats of the hall
			List<CinemaSeat> existingSeats = hallSeatSER.getSeatsByHall(hallId);

			// A set to keep track of seat IDs that exist in the request
			Set<Long> seatIdsInRequest = new HashSet<>();

			// Loop through the seat edit requests and update the seats in the database
			for (SeatEditRequest seatRequest : seatEditRequests) {
				Optional<CinemaSeat> optionalSeat = hallSeatSER.findSeatByHallAndPosition(
						hallId, seatRequest.getRow(), seatRequest.getCol());

				if (optionalSeat.isPresent()) {
					// Update existing seat
					CinemaSeat seat = optionalSeat.get();
					seat.setSeatType(ESeat.valueOf(seatRequest.getType()));
					seat.setStatus(ESeatStatus.valueOf(seatRequest.getStatus()));
					hallSeatSER.saveSeat(seat);

					// Add seat ID to the request set
					seatIdsInRequest.add(seat.getId());
				} else {
					// Create and save a new seat if it doesn't exist
					CinemaSeat newSeat = new CinemaSeat();
					newSeat.setCinemaHall(hall);
					newSeat.setRowIndex(seatRequest.getRow());
					newSeat.setColIndex(seatRequest.getCol());
					newSeat.setSeatType(ESeat.valueOf(seatRequest.getType()));
					newSeat.setStatus(ESeatStatus.valueOf(seatRequest.getStatus()));
					hallSeatSER.saveSeat(newSeat);

					// Add the new seat ID to the request set
					seatIdsInRequest.add(newSeat.getId());
				}
			}

			// Delete seats that are not in the request
			for (CinemaSeat existingSeat : existingSeats) {
				if (!seatIdsInRequest.contains(existingSeat.getId())) {
					hallSeatSER.deleteSeat(existingSeat);
				}
			}

			return ResponseEntity.ok(new MyApiResponse("Seats updated successfully"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse("An error occurred while updating seats: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
		}
	}

}
