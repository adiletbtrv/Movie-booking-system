package com.cinema.movie.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateScreeningRequest {
    private Long movieId;
    private Long hallId;
    private LocalDateTime startTime;
    private Double price;
}
