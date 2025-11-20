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

    public Map<String, Object> getPerkCollectionStatistics(Long userId) {
        String sql = """
            SELECT 
                COUNT(DISTINCT p.perk_id) AS total_perks,
                COUNT(DISTINCT CASE WHEN c.user_id IS NOT NULL THEN p.perk_id END) AS collected_perks
            FROM perks p
            LEFT JOIN collections c ON c.perk_id = p.perk_id AND c.user_id = ?
        """;

        return jdbcTemplate.queryForMap(sql, userId);
    }

    public List<Map<String, Object>> findPerkCollectionList(Long userId, String movieTitle, String filter) {
        StringBuilder sql = new StringBuilder("""
            SELECT 
                m.movie_id,
                m.title AS movie_title,
                m.image AS movie_image,
                COUNT(DISTINCT p.perk_id) AS total_count,
                COUNT(DISTINCT CASE WHEN c.user_id IS NOT NULL THEN p.perk_id END) AS collected_count
            FROM movies m
            JOIN events e ON e.movie_id = m.movie_id
            JOIN perks p ON p.event_id = e.event_id
            LEFT JOIN collections c ON c.perk_id = p.perk_id AND c.user_id = ?
            WHERE 1=1
        """);

        if (movieTitle != null && !movieTitle.trim().isEmpty()) {
            sql.append(" AND m.title ILIKE ?");
        }

        sql.append(" GROUP BY m.movie_id, m.title, m.image");

        if (filter != null && !filter.isEmpty() && !filter.equals("전체")) {
            if (filter.equals("수집 완료")) {
                sql.append(" HAVING COUNT(DISTINCT CASE WHEN c.user_id IS NOT NULL THEN p.perk_id END) = COUNT(DISTINCT p.perk_id)");
            } else if (filter.equals("미수집")) {
                sql.append(" HAVING COUNT(DISTINCT CASE WHEN c.user_id IS NOT NULL THEN p.perk_id END) = 0");
            }
        }

        sql.append(" ORDER BY m.movie_id DESC");

        if (movieTitle != null && !movieTitle.trim().isEmpty()) {
            return jdbcTemplate.queryForList(sql.toString(), userId, "%" + movieTitle + "%");
        }
        return jdbcTemplate.queryForList(sql.toString(), userId);
    }

    public List<Map<String, Object>> findPerksByMovieId(Long userId, Long movieId) {
        String sql = """
            SELECT 
                p.perk_id,
                e.week_no,
                p.name,
                p.type,
                p.image,
                CASE WHEN c.user_id IS NULL THEN FALSE ELSE TRUE END AS collected
            FROM events e
            JOIN perks p ON p.event_id = e.event_id
            LEFT JOIN collections c ON c.perk_id = p.perk_id AND c.user_id = ?
            WHERE e.movie_id = ?
            ORDER BY e.week_no, p.perk_id
        """;

        return jdbcTemplate.queryForList(sql, userId, movieId);
    }
}

