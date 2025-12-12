package com.cinema.movie.service;

import com.cinema.movie.domain.Screening;
import com.cinema.movie.domain.Ticket;
import com.cinema.movie.domain.User;
import com.cinema.movie.dto.BookingRequest;
import com.cinema.movie.dto.ScreeningDto;
import com.cinema.movie.dto.TicketDto;
import com.cinema.movie.repository.ScreeningRepository;
import com.cinema.movie.repository.TicketRepository;
import com.cinema.movie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final ScreeningRepository screeningRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ScreeningDto> getScreeningsByMovieId(Long movieId) {
        return screeningRepository.findByMovieId(movieId).stream()
                .map(this::toScreeningDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketDto> getTakenSeats(Long screeningId) {
        return ticketRepository.findByScreeningId(screeningId).stream()
                .map(this::toTicketDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketDto> getMyBookings(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return ticketRepository.findByUserId(user.getId()).stream()
                .map(this::toTicketDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketDto bookSeat(BookingRequest request) {
        if (ticketRepository.findByScreeningIdAndRowIndexAndSeatIndex(
                request.getScreeningId(), request.getRowIndex(), request.getSeatIndex()).isPresent()) {
            throw new RuntimeException("Seat already booked");
        }

        Screening screening = screeningRepository.findById(request.getScreeningId())
                .orElseThrow(() -> new RuntimeException("Screening not found"));

        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Ticket ticket = Ticket.builder()
                .screening(screening)
                .rowIndex(request.getRowIndex())
                .seatIndex(request.getSeatIndex())
                .isBooked(true)
                .user(user)
                .build();

        ticket = ticketRepository.save(ticket);
        return toTicketDto(ticket);
    }

    private ScreeningDto toScreeningDto(Screening screening) {
        ScreeningDto dto = new ScreeningDto();
        dto.setId(screening.getId());
        dto.setMovieId(screening.getMovie().getId());
        dto.setHallId(screening.getHall().getId());
        dto.setHallName(screening.getHall().getName());
        dto.setStartTime(screening.getStartTime());
        dto.setPrice(screening.getPrice());
        dto.setRows(screening.getHall().getRows());
        dto.setSeatsPerRow(screening.getHall().getSeatsPerRow());
        return dto;
    }

    private TicketDto toTicketDto(Ticket ticket) {
        return TicketDto.builder()
                .id(ticket.getId())
                .screeningId(ticket.getScreening().getId())
                .rowIndex(ticket.getRowIndex())
                .seatIndex(ticket.getSeatIndex())
                .isBooked(ticket.getIsBooked())
                // Populate expanded details
                .movieTitle(ticket.getScreening().getMovie().getTitle())
                .screeningTime(ticket.getScreening().getStartTime())
                .hallName(ticket.getScreening().getHall().getName())
                .build();
    }
}
