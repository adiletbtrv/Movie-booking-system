package com.cinema.movie.controller;

import com.cinema.movie.dto.BookingRequest;
import com.cinema.movie.dto.ScreeningDto;
import com.cinema.movie.dto.TicketDto;
import com.cinema.movie.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/screenings")
    public ResponseEntity<List<ScreeningDto>> getScreenings(@RequestParam Long movieId) {
        return ResponseEntity.ok(bookingService.getScreeningsByMovieId(movieId));
    }

    @GetMapping("/screenings/{id}/seats")
    public ResponseEntity<List<TicketDto>> getTakenSeats(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getTakenSeats(id));
    }

    @PostMapping("/bookings")
    public ResponseEntity<TicketDto> bookSeat(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.bookSeat(request));
    }
    
    @GetMapping("/bookings/my")
    public ResponseEntity<List<TicketDto>> getMyBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(bookingService.getMyBookings(auth.getName()));
    }
}
