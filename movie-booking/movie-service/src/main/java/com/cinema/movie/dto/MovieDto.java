package com.cinema.movie.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class MovieDto {
    private Long id;
    @NotBlank
    private String title;
    private String description;
    private Long tmdbId;
    private Integer durationMinutes;
    private LocalDate releaseDate;
    private String posterUrl;
    private Double rating;
    private String trailerUrl;
    private List<String> genres;
    private List<ActorDto> actors;
}
