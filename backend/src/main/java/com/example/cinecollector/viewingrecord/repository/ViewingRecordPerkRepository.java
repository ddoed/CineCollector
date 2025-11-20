package com.example.cinecollector.viewingrecord.repository;

import com.example.cinecollector.viewingrecord.entity.ViewingRecordPerk;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ViewingRecordPerkRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ViewingRecordPerk> rowMapper = (rs, rowNum) ->
            ViewingRecordPerk.builder()
                    .recordId(rs.getLong("record_id"))
                    .perkId(rs.getLong("perk_id"))
                    .build();

    public ViewingRecordPerk save(ViewingRecordPerk viewingRecordPerk) {
        String sql = """
            INSERT INTO viewing_record_perk
            (record_id, perk_id)
            VALUES (?, ?)
            ON CONFLICT (record_id, perk_id) DO NOTHING
            RETURNING *
        """;

        List<ViewingRecordPerk> result = jdbcTemplate.query(sql, rowMapper,
                viewingRecordPerk.getRecordId(),
                viewingRecordPerk.getPerkId()
        );

        if (result.isEmpty()) {
            return viewingRecordPerk;
        }
        return result.get(0);
    }

    public List<ViewingRecordPerk> findAllByRecordId(Long recordId) {
        String sql = """
            SELECT *
            FROM viewing_record_perk
            WHERE record_id = ?
        """;

        return jdbcTemplate.query(sql, rowMapper, recordId);
    }

    public List<ViewingRecordPerk> findAllByPerkId(Long perkId) {
        String sql = """
            SELECT *
            FROM viewing_record_perk
            WHERE perk_id = ?
        """;

        return jdbcTemplate.query(sql, rowMapper, perkId);
    }

    public void delete(Long recordId, Long perkId) {
        jdbcTemplate.update(
                "DELETE FROM viewing_record_perk WHERE record_id = ? AND perk_id = ?",
                recordId, perkId
        );
    }

    public void deleteByRecordId(Long recordId) {
        jdbcTemplate.update("DELETE FROM viewing_record_perk WHERE record_id = ?", recordId);
    }
}

