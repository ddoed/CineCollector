package com.example.cinecollector.theater.repository;

import com.example.cinecollector.theater.entity.Theater;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TheaterRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Theater> rowMapper = (rs, i) -> Theater.builder()
            .theaterId(rs.getLong("theater_id"))
            .name(rs.getString("name"))
            .location(rs.getString("location"))
            .managerId(rs.getLong("manager_id"))
            .build();

    public Theater save(Theater t) {
        String sql = """
            INSERT INTO theaters(name, location, manager_id)
            VALUES (?, ?, ?)
            RETURNING theater_id, name, location, manager_id
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                t.getName(), t.getLocation(), t.getManagerId());
    }

    public Optional<Theater> findById(Long id) {
        String sql = "SELECT * FROM theaters WHERE theater_id = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public Optional<Theater> findByManagerId(Long managerId) {
        String sql = "SELECT * FROM theaters WHERE manager_id = ?";
        return jdbcTemplate.query(sql, rowMapper, managerId).stream().findFirst();
    }

    public List<Theater> findAll() {
        return jdbcTemplate.query("SELECT * FROM theaters", rowMapper);
    }

    public Theater update(Theater t) {
        String sql = """
            UPDATE theaters
            SET name = ?, location = ?
            WHERE theater_id = ?
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                t.getName(),
                t.getLocation(),
                t.getTheaterId()
        );
    }

    public void delete(Long id) {
        jdbcTemplate.update("DELETE FROM theaters WHERE theater_id = ?", id);
    }
}


