package com.example.cinecollector.collection.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import com.example.cinecollector.collection.entity.Collection;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CollectionRepository {

    private final JdbcTemplate jdbcTemplate;

    public void save(Collection c) {
        String sql = """
            INSERT INTO collections (user_id, perk_id, quantity, obtained_date)
            VALUES (?, ?, ?, ?)
        """;

        jdbcTemplate.update(sql, c.getUserId(), c.getPerkId(), c.getQuantity(), c.getObtainedDate());
    }

    public Optional<Collection> findById(Long userId, Long perkId) {
        String sql = "SELECT * FROM collections WHERE user_id = ? AND perk_id = ?";

        List<Collection> list = jdbcTemplate.query(sql, (rs, n) ->
                        Collection.builder()
                                .userId(rs.getLong("user_id"))
                                .perkId(rs.getLong("perk_id"))
                                .quantity(rs.getInt("quantity"))
                                .obtainedDate(rs.getDate("obtained_date") != null
                                        ? rs.getDate("obtained_date").toLocalDate() : null)
                                .build(),
                userId, perkId
        );

        return list.stream().findFirst();
    }

    public void update(Collection c) {
        String sql = """
            UPDATE collections
            SET quantity = ?, obtained_date = ?
            WHERE user_id = ? AND perk_id = ?
        """;

        jdbcTemplate.update(sql,
                c.getQuantity(), c.getObtainedDate(),
                c.getUserId(), c.getPerkId()
        );
    }

    public void delete(Long userId, Long perkId) {
        String sql = "DELETE FROM collections WHERE user_id = ? AND perk_id = ?";
        jdbcTemplate.update(sql, userId, perkId);
    }

    public List<Collection> findAllByUserId(Long userId) {
        String sql = "SELECT * FROM collections WHERE user_id = ? ORDER BY obtained_date DESC NULLS LAST";

        return jdbcTemplate.query(sql, (rs, n) ->
                        Collection.builder()
                                .userId(rs.getLong("user_id"))
                                .perkId(rs.getLong("perk_id"))
                                .quantity(rs.getInt("quantity"))
                                .obtainedDate(rs.getDate("obtained_date") != null
                                        ? rs.getDate("obtained_date").toLocalDate() : null)
                                .build(),
                userId
        );
    }
}

