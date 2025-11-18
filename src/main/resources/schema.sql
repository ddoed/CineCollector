DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS events CASCADE;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    release_date DATE,
    genre VARCHAR(50),
    duration INT
);

CREATE TABLE IF NOT EXISTS events (
    event_id    BIGSERIAL PRIMARY KEY,
    movie_id    BIGINT NOT NULL,
    creator_id  BIGINT NOT NULL,
    title       VARCHAR(100) NOT NULL,
    start_date  DATE,
    end_date    DATE,
    week_no     INT,

    CONSTRAINT fk_event_movie
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_event_creator
    FOREIGN KEY (creator_id) REFERENCES users(user_id)
    ON DELETE CASCADE
);
