package com.example.cinecollector.perk.repository;

import com.example.cinecollector.perk.entity.Perk;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PerkRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Perk> rowMapper = (rs, rowNum) ->
            Perk.builder()
                    .perkId(rs.getLong("perk_id"))
                    .eventId(rs.getLong("event_id"))
                    .name(rs.getString("name"))
                    .type(rs.getString("type"))
                    .limitPerUser(rs.getObject("limit_per_user", Integer.class))
                    .quantity(rs.getObject("quantity", Integer.class))
                    .description(rs.getString("description"))
                    .build();

    public Perk save(Perk perk) {
        String sql = """
            INSERT INTO perks(event_id, name, type, limit_per_user, quantity, description)
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING perk_id, event_id, name, type, limit_per_user, quantity, description
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                perk.getEventId(),
                perk.getName(),
                perk.getType(),
                perk.getLimitPerUser(),
                perk.getQuantity(),
                perk.getDescription()
        );
    }

    public Optional<Perk> findById(Long perkId) {
        String sql = "SELECT * FROM perks WHERE perk_id = ?";
        List<Perk> result = jdbcTemplate.query(sql, rowMapper, perkId);
        return result.stream().findFirst();
    }

    public List<Perk> findByEventId(Long eventId) {
        String sql = "SELECT * FROM perks WHERE event_id = ? ORDER BY perk_id DESC";
        return jdbcTemplate.query(sql, rowMapper, eventId);
    }

    public Perk update(Perk perk) {
        String sql = """
            UPDATE perks
            SET name = ?, type = ?, limit_per_user = ?, quantity = ?, description = ?
            WHERE perk_id = ?
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                perk.getName(),
                perk.getType(),
                perk.getLimitPerUser(),
                perk.getQuantity(),
                perk.getDescription(),
                perk.getPerkId()
        );
    }

    public void delete(Long perkId) {
        jdbcTemplate.update("DELETE FROM perks WHERE perk_id = ?", perkId);
    }
}

