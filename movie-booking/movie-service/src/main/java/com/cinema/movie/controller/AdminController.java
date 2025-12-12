package com.cinema.movie.controller;

import com.cinema.movie.domain.Hall;
import com.cinema.movie.dto.AdminStatsDto;
import com.cinema.movie.dto.CreateScreeningRequest;
import com.cinema.movie.dto.ScreeningDto;
import com.cinema.movie.repository.HallRepository;
import com.cinema.movie.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final HallRepository hallRepository;

    @PostMapping("/screenings")
    public ResponseEntity<ScreeningDto> createScreening(@RequestBody CreateScreeningRequest request) {
        return ResponseEntity.ok(adminService.createScreening(request));
    }
    
    @DeleteMapping("/screenings/{id}")
    public ResponseEntity<Void> deleteScreening(@PathVariable Long id) {
        adminService.deleteScreening(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/movies/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        adminService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }
    
    @GetMapping("/halls")
    public ResponseEntity<List<Hall>> getAllHalls() {
        return ResponseEntity.ok(hallRepository.findAll());
    }
}
