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
            INSERT INTO theater(name, location, manager_id)
            VALUES (?, ?, ?)
            RETURNING theater_id, name, location, manager_id
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                t.getName(), t.getLocation(), t.getManagerId());
    }

    public Optional<Theater> findById(Long id) {
        String sql = "SELECT * FROM theater WHERE theater_id = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public Optional<Theater> findByManagerId(Long managerId) {
        String sql = "SELECT * FROM theater WHERE manager_id = ?";
        return jdbcTemplate.query(sql, rowMapper, managerId).stream().findFirst();
    }

    public List<Theater> findAll() {
        return jdbcTemplate.query("SELECT * FROM theater", rowMapper);
    }

    public void update(Theater t) {
        String sql = """
            UPDATE theater
            SET name = ?, location = ?
            WHERE theater_id = ?
        """;

        jdbcTemplate.update(sql,
                t.getName(), t.getLocation(), t.getTheaterId());
    }

    public void delete(Long id) {
        jdbcTemplate.update("DELETE FROM theater WHERE theater_id = ?", id);
    }
}


