package com.cinema.movie.repository;

import com.cinema.movie.domain.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByScreeningId(Long screeningId);
    Optional<Ticket> findByScreeningIdAndRowIndexAndSeatIndex(Long screeningId, Integer rowIndex, Integer seatIndex);
    List<Ticket> findByUserId(Long userId);
}
