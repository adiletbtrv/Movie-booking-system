package com.cinema.movie.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "actors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Actor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "tmdb_id", unique = true)
    private Long tmdbId;

    @Column(name = "photo_url", length = 512)
    private String photoUrl;

    public Actor(String name, Long tmdbId) {
        this.name = name;
        this.tmdbId = tmdbId;
    }
}
