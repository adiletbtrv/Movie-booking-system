package com.cinema.movie.service;

import com.cinema.movie.domain.Hall;
import com.cinema.movie.domain.Movie;
import com.cinema.movie.domain.Screening;
import com.cinema.movie.domain.Ticket;
import com.cinema.movie.dto.AdminStatsDto;
import com.cinema.movie.dto.CreateScreeningRequest;
import com.cinema.movie.dto.ScreeningDto;
import com.cinema.movie.repository.HallRepository;
import com.cinema.movie.repository.MovieRepository;
import com.cinema.movie.repository.ScreeningRepository;
import com.cinema.movie.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;
    private final HallRepository hallRepository;
    private final TicketRepository ticketRepository;

    @Transactional
    public ScreeningDto createScreening(CreateScreeningRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        Hall hall = hallRepository.findById(request.getHallId())
                .orElseThrow(() -> new RuntimeException("Hall not found"));

        Screening screening = Screening.builder()
                .movie(movie)
                .hall(hall)
                .startTime(request.getStartTime())
                .price(request.getPrice())
                .build();

        screening = screeningRepository.save(screening);
        return toScreeningDto(screening);
    }

    @Transactional
    public void deleteMovie(Long id) {
        // Cascade delete is handled by database or JPA if configured, 
        // but for safety we can delete related entities or rely on ON DELETE CASCADE.
        // Assuming database schema handles it or we manually delete screenings first.
        // For production ready, manual cleanup is safer if constraints prevent direct delete.
        
        // Find screenings
        List<Screening> screenings = screeningRepository.findByMovieId(id);
        for (Screening s : screenings) {
            deleteScreening(s.getId());
        }
        movieRepository.deleteById(id);
    }

    @Transactional
    public void deleteScreening(Long id) {
        // Delete tickets first
        List<Ticket> tickets = ticketRepository.findByScreeningId(id);
        ticketRepository.deleteAll(tickets);
        screeningRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getStats() {
        List<Ticket> soldTickets = ticketRepository.findAll().stream()
                .filter(Ticket::getIsBooked)
                .toList();
        
        long ticketsSold = soldTickets.size();
        
        double totalRevenue = soldTickets.stream()
                .mapToDouble(t -> t.getScreening().getPrice())
                .sum();
        
        long activeMovies = movieRepository.count();
        
        // Occupancy Rate: Total Sold Seats / Total Available Seats in All Past/Present Screenings
        // For simplicity, let's calculate based on existing screenings in DB
        List<Screening> allScreenings = screeningRepository.findAll();
        long totalCapacity = allScreenings.stream()
                .mapToLong(s -> (long) s.getHall().getRows() * s.getHall().getSeatsPerRow())
                .sum();
        
        double occupancyRate = totalCapacity > 0 ? (double) ticketsSold / totalCapacity : 0.0;

        return AdminStatsDto.builder()
                .totalRevenue(totalRevenue)
                .activeMovies(activeMovies)
                .ticketsSold(ticketsSold)
                .occupancyRate(occupancyRate)
                .build();
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
}
