package com.example.cinecollector.collection.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import com.example.cinecollector.collection.entity.Collection;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CollectionRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Collection> rowMapper = (rs, rowNum) ->
            Collection.builder()
                    .userId(rs.getLong("user_id"))
                    .perkId(rs.getLong("perk_id"))
                    .quantity(rs.getInt("quantity"))
                    .obtainedDate(rs.getDate("obtained_date") != null
                            ? rs.getDate("obtained_date").toLocalDate()
                            : null)
                    .build();

    public Collection save(Collection c) {
        String sql = """
            INSERT INTO collections (user_id, perk_id, quantity, obtained_date)
            VALUES (?, ?, ?, ?)
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                c.getUserId(),
                c.getPerkId(),
                c.getQuantity(),
                c.getObtainedDate()
        );
    }

    public Optional<Collection> findById(Long userId, Long perkId) {
        String sql = "SELECT * FROM collections WHERE user_id = ? AND perk_id = ?";
        return jdbcTemplate.query(sql, rowMapper, userId, perkId).stream().findFirst();
    }

    public Collection update(Collection c) {
        String sql = """
            UPDATE collections
            SET quantity = ?, obtained_date = ?
            WHERE user_id = ? AND perk_id = ?
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                c.getQuantity(),
                c.getObtainedDate(),
                c.getUserId(),
                c.getPerkId()
        );
    }

    public void delete(Long userId, Long perkId) {
        String sql = "DELETE FROM collections WHERE user_id = ? AND perk_id = ?";
        jdbcTemplate.update(sql, userId, perkId);
    }

    public List<Collection> findAllByUserId(Long userId) {
        String sql = """
            SELECT *
            FROM collections
            WHERE user_id = ?
            ORDER BY obtained_date DESC NULLS LAST
        """;

        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public List<Collection> findAllByPerkId(Long perkId) {
        String sql = """
            SELECT *
            FROM collections
            WHERE perk_id = ?
            ORDER BY obtained_date DESC NULLS LAST
        """;

        return jdbcTemplate.query(sql, rowMapper, perkId);
    }

    public List<Map<String, Object>> findApplicantsByPerkId(Long perkId) {
        String sql = """
            SELECT 
                c.user_id,
                c.obtained_date,
                c.quantity,
                u.name,
                u.email
            FROM collections c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.perk_id = ?
            ORDER BY c.obtained_date DESC NULLS LAST, c.user_id
        """;

        return jdbcTemplate.queryForList(sql, perkId);
    }
}

