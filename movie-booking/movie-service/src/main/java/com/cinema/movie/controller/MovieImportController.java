package com.cinema.movie.controller;

import com.cinema.movie.dto.MovieDto;
import com.cinema.movie.service.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/movies/import/tmdb")
@RequiredArgsConstructor
public class MovieImportController {

    private final TmdbService tmdbService;

    @PostMapping("/{tmdbId}")
    public ResponseEntity<MovieDto> importFromTmdb(@PathVariable Long tmdbId) {
        return ResponseEntity.ok(tmdbService.importMovie(tmdbId));
    }
}
