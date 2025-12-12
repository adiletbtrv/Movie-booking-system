package com.cinema.movie.service;

import com.cinema.movie.domain.Actor;
import com.cinema.movie.domain.Genre;
import com.cinema.movie.domain.Movie;
import com.cinema.movie.dto.ActorDto;
import com.cinema.movie.dto.MovieDto;
import com.cinema.movie.repository.ActorRepository;
import com.cinema.movie.repository.GenreRepository;
import com.cinema.movie.repository.MovieRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovieServiceTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private GenreRepository genreRepository;
    
    @Mock
    private ActorRepository actorRepository;

    @InjectMocks
    private MovieService movieService;

    private MovieDto movieDto;
    private Movie movie;

    @BeforeEach
    void setUp() {
        movieDto = new MovieDto();
        movieDto.setTitle("Inception");
        movieDto.setDescription("Dream within a dream");

        movie = new Movie();
        movie.setId(1L);
        movie.setTitle("Inception");
        movie.setDescription("Dream within a dream");
    }

    @Test
    void createMovie_ShouldReturnSavedMovie() {
        when(movieRepository.save(any(Movie.class))).thenReturn(movie);

        MovieDto result = movieService.createMovie(movieDto);

        assertNotNull(result);
        assertEquals("Inception", result.getTitle());
        verify(movieRepository).save(any(Movie.class));
    }
    
    @Test
    void createMovie_WithGenresAndActors_ShouldSaveCorrectly() {
        movieDto.setGenres(List.of("Action"));
        movieDto.setActors(List.of(new ActorDto("Leo", 1L, "url", "Cobb")));
        
        Genre genre = new Genre("Action");
        when(genreRepository.findByName("Action")).thenReturn(Optional.of(genre));
        
        Actor actor = new Actor("Leo", 1L);
        when(actorRepository.findByTmdbId(1L)).thenReturn(Optional.of(actor));
        
        Movie savedMovie = new Movie();
        savedMovie.setId(1L);
        savedMovie.setTitle("Inception");
        savedMovie.setGenres(new HashSet<>(Collections.singletonList(genre)));
        savedMovie.addActor(actor, "Cobb");
        
        when(movieRepository.save(any(Movie.class))).thenReturn(savedMovie);
        
        MovieDto result = movieService.createMovie(movieDto);
        
        assertNotNull(result);
        assertEquals(1, result.getGenres().size());
        assertEquals("Action", result.getGenres().get(0));
        assertEquals(1, result.getActors().size());
        assertEquals("Leo", result.getActors().get(0).getName());
        assertEquals("Cobb", result.getActors().get(0).getCharacterName());
    }

    @Test
    void getMovieById_ShouldReturnMovie_WhenFound() {
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));

        MovieDto result = movieService.getMovieById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getMovieById_ShouldThrowException_WhenNotFound() {
        when(movieRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> movieService.getMovieById(1L));
    }
}
