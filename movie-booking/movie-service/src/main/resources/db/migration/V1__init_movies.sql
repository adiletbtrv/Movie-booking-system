CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tmdb_id BIGINT UNIQUE,
    duration_minutes INTEGER,
    release_date DATE,
    poster_url VARCHAR(512),
    rating DOUBLE PRECISION,
    trailer_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE genres (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE movie_genres (
    movie_id BIGINT REFERENCES movies(id),
    genre_id BIGINT REFERENCES genres(id),
    PRIMARY KEY (movie_id, genre_id)
);

CREATE TABLE actors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tmdb_id BIGINT UNIQUE,
    photo_url VARCHAR(512)
);

CREATE TABLE movie_actors (
    movie_id BIGINT REFERENCES movies(id),
    actor_id BIGINT REFERENCES actors(id),
    character_name VARCHAR(255),
    PRIMARY KEY (movie_id, actor_id)
);
