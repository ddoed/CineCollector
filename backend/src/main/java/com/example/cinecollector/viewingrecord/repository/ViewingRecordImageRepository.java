package com.example.cinecollector.viewingrecord.repository;

import com.example.cinecollector.viewingrecord.entity.ViewingRecordImage;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ViewingRecordImageRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ViewingRecordImage> rowMapper = (rs, rowNum) ->
            ViewingRecordImage.builder()
                    .imageId(rs.getLong("image_id"))
                    .recordId(rs.getLong("record_id"))
                    .imageUrl(rs.getString("image_url"))
                    .build();

    public ViewingRecordImage save(ViewingRecordImage image) {
        String sql = """
            INSERT INTO viewingrecord_image
            (record_id, image_url)
            VALUES (?, ?)
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                image.getRecordId(),
                image.getImageUrl()
        );
    }

    public Optional<ViewingRecordImage> findById(Long imageId) {
        String sql = "SELECT * FROM viewingrecord_image WHERE image_id = ?";
        return jdbcTemplate.query(sql, rowMapper, imageId).stream().findFirst();
    }

    public List<ViewingRecordImage> findAllByRecordId(Long recordId) {
        String sql = """
            SELECT *
            FROM viewingrecord_image
            WHERE record_id = ?
            ORDER BY image_id DESC
        """;

        return jdbcTemplate.query(sql, rowMapper, recordId);
    }

    public void delete(Long imageId) {
        jdbcTemplate.update("DELETE FROM viewingrecord_image WHERE image_id = ?", imageId);
    }

    public void deleteByRecordId(Long recordId) {
        jdbcTemplate.update("DELETE FROM viewingrecord_image WHERE record_id = ?", recordId);
    }
}

