package com.example.cinecollector.movie.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class MovieCollectionRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> findMoviePerkRaw(Long userId, Long movieId) {
        String sql = """
            SELECT
                e.week_no,
                e.start_date,
                e.end_date,
                u.user_id AS creator_id,
                u.name AS creator_name,
                p.perk_id,
                p.name AS perk_name,
                p.type AS perk_type,
                CASE WHEN c.user_id IS NULL THEN FALSE ELSE TRUE END AS collected
            FROM events e
            JOIN perks p ON p.event_id = e.event_id
            JOIN users u ON u.user_id = e.creator_id
            LEFT JOIN collections c 
                ON c.perk_id = p.perk_id AND c.user_id = ?
            WHERE e.movie_id = ?
            ORDER BY e.week_no, e.start_date, u.user_id, p.perk_id
        """;

        return jdbcTemplate.queryForList(sql, userId, movieId);
    }

    public List<Long> findCollectedMovieIds(Long userId) {
        String sql = """
        SELECT DISTINCT e.movie_id
        FROM collections c
        JOIN perks p ON p.perk_id = c.perk_id
        JOIN events e ON e.event_id = p.event_id
        WHERE c.user_id = ?
    """;

        return jdbcTemplate.queryForList(sql, Long.class, userId);
    }
}

