package com.cinema.movie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketDto {
    private Long id;
    private Long screeningId;
    private Integer rowIndex;
    private Integer seatIndex;
    private Boolean isBooked;

    private String movieTitle;
    private LocalDateTime screeningTime;
    private String hallName;
}
