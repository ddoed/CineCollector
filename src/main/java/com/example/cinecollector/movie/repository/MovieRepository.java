package com.example.cinecollector.movie.repository;

import com.example.cinecollector.movie.entity.Movie;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MovieRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Movie> rowMapper = (rs, rowNum) ->
            Movie.builder()
                    .movieId(rs.getLong("movie_id"))
                    .title(rs.getString("title"))
                    .releaseDate(rs.getDate("release_date") != null ?
                            rs.getDate("release_date").toLocalDate() : null)
                    .genre(rs.getString("genre"))
                    .duration(rs.getInt("duration"))
                    .build();

    public Movie save(Movie movie) {
        String sql = """
            INSERT INTO movies (title, release_date, genre, duration)
            VALUES (?, ?, ?, ?)
            RETURNING movie_id, title, release_date, genre, duration
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                movie.getTitle(),
                movie.getReleaseDate(),
                movie.getGenre(),
                movie.getDuration()
        );
    }

    public Optional<Movie> findById(Long id) {
        String sql = "SELECT * FROM movies WHERE movie_id = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public List<Movie> findAll() {
        String sql = "SELECT * FROM movies ORDER BY movie_id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Movie update(Movie movie) {
        String sql = """
            UPDATE movies SET title=?, release_date=?, genre=?, duration=?
            WHERE movie_id=?
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                movie.getTitle(),
                movie.getReleaseDate(),
                movie.getGenre(),
                movie.getDuration(),
                movie.getMovieId()
        );
    }

    public int delete(Long id) {
        return jdbcTemplate.update("DELETE FROM movies WHERE movie_id=?", id);
    }

    public boolean existsById(@NotNull Long movieId) {
        String sql = "SELECT EXISTS (SELECT 1 FROM movies WHERE movie_id = ?)";
        Boolean exists = jdbcTemplate.queryForObject(sql, Boolean.class, movieId);
        return exists != null && exists;
    }

    public String findMovieTitle(Long movieId) {
        return jdbcTemplate.queryForObject(
                "SELECT title FROM movies WHERE movie_id = ?",
                String.class,
                movieId
        );
    }
}

