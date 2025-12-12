package com.cinema.movie.repository;

import com.cinema.movie.domain.Actor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActorRepository extends JpaRepository<Actor, Long> {
    Optional<Actor> findByTmdbId(Long tmdbId);
    Optional<Actor> findByName(String name);
}
