package com.cinema.movie.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long screeningId;
    private Integer rowIndex;
    private Integer seatIndex;
}
