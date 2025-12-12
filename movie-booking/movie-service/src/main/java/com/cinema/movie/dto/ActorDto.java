package com.cinema.movie.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActorDto {
    private String name;
    private Long tmdbId;
    private String photoUrl;
    private String characterName;
}
