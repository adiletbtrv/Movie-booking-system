package com.cinema.movie.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsDto {
    private Double totalRevenue;
    private Long activeMovies;
    private Long ticketsSold;
    private Double occupancyRate;
}
