package com.cinema.movie.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ScreeningDto {
    private Long id;
    private Long movieId;
    private Long hallId;
    private String hallName;
    private LocalDateTime startTime;
    private Double price;
    private Integer rows;
    private Integer seatsPerRow;
}
