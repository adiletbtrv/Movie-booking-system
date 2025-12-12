package com.cinema.movie.service;

import com.cinema.movie.domain.Actor;
import com.cinema.movie.domain.Genre;
import com.cinema.movie.domain.Movie;
import com.cinema.movie.dto.ActorDto;
import com.cinema.movie.dto.MovieDto;
import com.cinema.movie.repository.ActorRepository;
import com.cinema.movie.repository.GenreRepository;
import com.cinema.movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final ActorRepository actorRepository;

    @Transactional(readOnly = true)
    public List<MovieDto> getAllMovies() {
        return movieRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MovieDto getMovieById(Long id) {
        return movieRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    @Transactional
    public MovieDto createMovie(MovieDto movieDto) {
        Movie movie = toEntity(movieDto);
        movie = movieRepository.save(movie);
        return toDto(movie);
    }

    private MovieDto toDto(Movie movie) {
        MovieDto dto = new MovieDto();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setDescription(movie.getDescription());
        dto.setTmdbId(movie.getTmdbId());
        dto.setDurationMinutes(movie.getDurationMinutes());
        dto.setReleaseDate(movie.getReleaseDate());
        dto.setPosterUrl(movie.getPosterUrl());
        dto.setRating(movie.getRating());
        dto.setTrailerUrl(movie.getTrailerUrl());
        
        dto.setGenres(movie.getGenres().stream()
                .map(Genre::getName)
                .collect(Collectors.toList()));
        
        dto.setActors(movie.getActors().stream()
                .map(movieActor -> new ActorDto(
                        movieActor.getActor().getName(), 
                        movieActor.getActor().getTmdbId(), 
                        movieActor.getActor().getPhotoUrl(),
                        movieActor.getCharacterName()))
                .collect(Collectors.toList()));
                
        return dto;
    }

    private Movie toEntity(MovieDto dto) {
        Movie movie = new Movie();
        movie.setTitle(dto.getTitle());
        movie.setDescription(dto.getDescription());
        movie.setTmdbId(dto.getTmdbId());
        movie.setDurationMinutes(dto.getDurationMinutes());
        movie.setReleaseDate(dto.getReleaseDate());
        movie.setPosterUrl(dto.getPosterUrl());
        movie.setRating(dto.getRating());
        movie.setTrailerUrl(dto.getTrailerUrl());

        if (dto.getGenres() != null) {
            for (String genreName : dto.getGenres()) {
                Genre genre = genreRepository.findByName(genreName)
                        .orElseGet(() -> genreRepository.save(new Genre(genreName)));
                movie.getGenres().add(genre);
            }
        }

        if (dto.getActors() != null) {
            for (ActorDto actorDto : dto.getActors()) {
                Actor actor;
                if (actorDto.getTmdbId() != null) {
                    actor = actorRepository.findByTmdbId(actorDto.getTmdbId())
                            .orElseGet(() -> {
                                Actor newActor = new Actor();
                                newActor.setName(actorDto.getName());
                                newActor.setTmdbId(actorDto.getTmdbId());
                                newActor.setPhotoUrl(actorDto.getPhotoUrl());
                                return actorRepository.save(newActor);
                            });
                } else {
                     actor = actorRepository.findByName(actorDto.getName())
                            .orElseGet(() -> {
                                Actor newActor = new Actor();
                                newActor.setName(actorDto.getName());
                                newActor.setPhotoUrl(actorDto.getPhotoUrl());
                                return actorRepository.save(newActor);
                            });
                }
                movie.addActor(actor, actorDto.getCharacterName());
            }
        }
        return movie;
    }
}
