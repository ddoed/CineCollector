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
                    .build();

    public ViewingRecord save(ViewingRecord v) {
        String sql = """
            INSERT INTO viewing_records
            (user_id, movie_id, theater_id, view_date, review, is_public)
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                v.getUserId(),
                v.getMovieId(),
                v.getTheaterId(),
                v.getViewDate(),
                v.getReview(),
                v.getIsPublic()
        );
    }

    public Optional<ViewingRecord> findById(Long recordId) {
        String sql = "SELECT * FROM viewing_records WHERE record_id = ?";
        return jdbcTemplate.query(sql, rowMapper, recordId).stream().findFirst();
    }

    public ViewingRecord update(ViewingRecord v) {
        String sql = """
            UPDATE viewing_records
            SET view_date = ?, review = ?, is_public = ?
            WHERE record_id = ?
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                v.getViewDate(),
                v.getReview(),
                v.getIsPublic(),
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
}

