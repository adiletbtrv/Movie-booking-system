CREATE TABLE halls (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rows_count INTEGER NOT NULL,
    seats_per_row INTEGER NOT NULL
);

CREATE TABLE screenings (
    id BIGSERIAL PRIMARY KEY,
    movie_id BIGINT REFERENCES movies(id),
    hall_id BIGINT REFERENCES halls(id),
    start_time TIMESTAMP NOT NULL,
    price DOUBLE PRECISION NOT NULL
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    screening_id BIGINT REFERENCES screenings(id),
    row_index INTEGER NOT NULL,
    seat_index INTEGER NOT NULL,
    is_booked BOOLEAN DEFAULT TRUE,
    UNIQUE (screening_id, row_index, seat_index)
);
