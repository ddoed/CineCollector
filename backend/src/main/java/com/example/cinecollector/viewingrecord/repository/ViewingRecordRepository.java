package com.example.cinecollector.viewingrecord.repository;

import com.example.cinecollector.viewingrecord.entity.ViewingRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ViewingRecordRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ViewingRecord> rowMapper = (rs, rowNum) ->
            ViewingRecord.builder()
                    .recordId(rs.getLong("record_id"))
                    .userId(rs.getLong("user_id"))
                    .movieId(rs.getLong("movie_id"))
                    .theaterId(rs.getLong("theater_id"))
                    .viewDate(rs.getDate("view_date") != null
                            ? rs.getDate("view_date").toLocalDate() : null)
                    .review(rs.getString("review"))
                    .isPublic(rs.getBoolean("is_public"))
                    .createdAt(rs.getTimestamp("created_at"))
                    .rating(rs.getFloat("rating"))
                    .build();

    public ViewingRecord save(ViewingRecord v) {
        String sql = """
            INSERT INTO viewing_records
            (user_id, movie_id, theater_id, view_date, review, is_public, rating, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                v.getUserId(),
                v.getMovieId(),
                v.getTheaterId(),
                v.getViewDate(),
                v.getReview(),
                v.getIsPublic(),
                v.getRating()
        );
    }

    public Optional<ViewingRecord> findById(Long recordId) {
        String sql = "SELECT * FROM viewing_records WHERE record_id = ?";
        return jdbcTemplate.query(sql, rowMapper, recordId).stream().findFirst();
    }

    public ViewingRecord update(ViewingRecord v) {
        String sql = """
            UPDATE viewing_records
            SET view_date = ?, review = ?, is_public = ?, rating = ?
            WHERE record_id = ?
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                v.getViewDate(),
                v.getReview(),
                v.getIsPublic(),
                v.getRating(),
                v.getRecordId()
        );
    }

    public void delete(Long recordId) {
        jdbcTemplate.update("DELETE FROM viewing_records WHERE record_id = ?", recordId);
    }

    public List<ViewingRecord> findAllByUserId(Long userId) {
        String sql = """
            SELECT *
            FROM viewing_records
            WHERE user_id = ?
            ORDER BY view_date DESC NULLS LAST
        """;

        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public List<ViewingRecord> findAllPublicRecords() {
        String sql = """
            SELECT *
            FROM viewing_records
            WHERE is_public = true
            ORDER BY created_at DESC
        """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<ViewingRecord> findAllByUserIdWithSearch(Long userId, String movieTitle) {
        if (movieTitle != null && !movieTitle.trim().isEmpty()) {
            String sql = """
                SELECT vr.*
                FROM viewing_records vr
                JOIN movies m ON vr.movie_id = m.movie_id
                WHERE vr.user_id = ? AND m.title ILIKE ?
                ORDER BY vr.created_at DESC
            """;
            return jdbcTemplate.query(sql, rowMapper, userId, "%" + movieTitle + "%");
        }

        String sql = """
            SELECT *
            FROM viewing_records
            WHERE user_id = ?
            ORDER BY created_at DESC
        """;
        return jdbcTemplate.query(sql, rowMapper, userId);
    }
}

