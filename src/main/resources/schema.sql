DROP TABLE IF EXISTS inventories CASCADE;
DROP TABLE IF EXISTS theaters CASCADE;
DROP TABLE IF EXISTS perks CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS collections CASCADE;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS movies (
    movie_id BIGSERIAL PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS perks (
    perk_id         BIGSERIAL PRIMARY KEY,
    event_id        BIGINT NOT NULL,
    name            VARCHAR(100) NOT NULL,
    type            VARCHAR(50),
    limit_per_user  INT,
    quantity        INT,
    description     VARCHAR(255),

    CONSTRAINT fk_perk_event
    FOREIGN KEY (event_id) REFERENCES events(event_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS theaters (
    theater_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    manager_id BIGINT NOT NULL,

    CONSTRAINT fk_theater_user
    FOREIGN KEY (manager_id) REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventories (
    theater_id BIGINT NOT NULL,
    perk_id BIGINT NOT NULL,
    stock INT,
    status VARCHAR(20),

    CONSTRAINT pk_inventory PRIMARY KEY (theater_id, perk_id),

    CONSTRAINT fk_inventory_theater
    FOREIGN KEY (theater_id) REFERENCES theaters(theater_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_inventory_perk
    FOREIGN KEY (perk_id) REFERENCES perks(perk_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collections (
    user_id     BIGINT NOT NULL,
    perk_id     BIGINT NOT NULL,
    obtained_date DATE,
    quantity    INT NOT NULL,

    CONSTRAINT pk_collections PRIMARY KEY (user_id, perk_id),

    CONSTRAINT fk_collection_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_collection_perk
    FOREIGN KEY (perk_id) REFERENCES perks(perk_id)
    ON DELETE CASCADE
    );
