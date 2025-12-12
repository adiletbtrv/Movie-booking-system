package com.cinema.movie.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "movie_actors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieActor {

    @EmbeddedId
    private MovieActorId id = new MovieActorId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("movieId")
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("actorId")
    @JoinColumn(name = "actor_id")
    private Actor actor;

    @Column(name = "character_name")
    private String characterName;

    public MovieActor(Movie movie, Actor actor, String characterName) {
        this.movie = movie;
        this.actor = actor;
        this.characterName = characterName;
        this.id = new MovieActorId(movie.getId(), actor.getId());
    }
}
