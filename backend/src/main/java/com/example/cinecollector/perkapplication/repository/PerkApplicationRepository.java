package com.example.cinecollector.perkapplication.repository;

import com.example.cinecollector.perkapplication.entity.PerkApplication;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PerkApplicationRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<PerkApplication> rowMapper = (rs, rowNum) ->
            PerkApplication.builder()
                    .applicationId(rs.getLong("application_id"))
                    .userId(rs.getLong("user_id"))
                    .perkId(rs.getLong("perk_id"))
                    .theaterId(rs.getLong("theater_id"))
                    .quantity(rs.getInt("quantity"))
                    .appliedAt(rs.getTimestamp("applied_at"))
                    .isObtained(rs.getBoolean("is_obtained"))
                    .build();

    public PerkApplication save(PerkApplication application) {
        String sql = """
            INSERT INTO perk_applications (user_id, perk_id, theater_id, quantity, applied_at, is_obtained)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                application.getUserId(),
                application.getPerkId(),
                application.getTheaterId(),
                application.getQuantity(),
                application.getIsObtained() != null ? application.getIsObtained() : false
        );
    }

    public Optional<PerkApplication> findById(Long applicationId) {
        String sql = "SELECT * FROM perk_applications WHERE application_id = ?";
        List<PerkApplication> result = jdbcTemplate.query(sql, rowMapper, applicationId);
        return result.stream().findFirst();
    }

    public List<PerkApplication> findByUserId(Long userId) {
        String sql = """
            SELECT * FROM perk_applications
            WHERE user_id = ?
            ORDER BY applied_at DESC
        """;
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public List<PerkApplication> findByPerkIdAndTheaterId(Long perkId, Long theaterId) {
        String sql = """
            SELECT * FROM perk_applications
            WHERE perk_id = ? AND theater_id = ?
            ORDER BY applied_at DESC
        """;
        return jdbcTemplate.query(sql, rowMapper, perkId, theaterId);
    }

    public Optional<PerkApplication> findByUserIdAndPerkIdAndTheaterId(Long userId, Long perkId, Long theaterId) {
        String sql = """
            SELECT * FROM perk_applications
            WHERE user_id = ? AND perk_id = ? AND theater_id = ?
            ORDER BY applied_at DESC
            LIMIT 1
        """;
        List<PerkApplication> result = jdbcTemplate.query(sql, rowMapper, userId, perkId, theaterId);
        return result.stream().findFirst();
    }

    public int countByUserIdAndPerkId(Long userId, Long perkId) {
        String sql = """
            SELECT COALESCE(SUM(quantity), 0)
            FROM perk_applications
            WHERE user_id = ? AND perk_id = ?
        """;
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId, perkId);
        return count != null ? count : 0;
    }

    public PerkApplication update(PerkApplication application) {
        String sql = """
            UPDATE perk_applications
            SET quantity = ?, is_obtained = ?
            WHERE application_id = ?
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                application.getQuantity(),
                application.getIsObtained() != null ? application.getIsObtained() : false,
                application.getApplicationId()
        );
    }

    public void delete(Long applicationId) {
        String sql = "DELETE FROM perk_applications WHERE application_id = ?";
        jdbcTemplate.update(sql, applicationId);
    }
}

