package com.example.cinecollector.inventory.repository;

import com.example.cinecollector.inventory.entity.Inventory;
import com.example.cinecollector.inventory.entity.PerkStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class InventoryRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Inventory> rowMapper = (rs, n) ->
            Inventory.builder()
                    .theaterId(rs.getLong("theater_id"))
                    .perkId(rs.getLong("perk_id"))
                    .stock(rs.getObject("stock", Integer.class))
                    .status(PerkStatus.valueOf(rs.getString("status")))
                    .build();

    public Inventory save(Inventory inv) {
        String sql = """
                INSERT INTO inventories (theater_id, perk_id, stock, status)
                VALUES (?, ?, ?, ?)
                RETURNING *
            """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                inv.getTheaterId(),
                inv.getPerkId(),
                inv.getStock(),
                inv.getStatus().name()
        );
    }

    public Optional<Inventory> findById(Long theaterId, Long perkId) {
        String sql = "SELECT * FROM inventories WHERE theater_id = ? AND perk_id = ?";
        List<Inventory> result = jdbcTemplate.query(sql, rowMapper, theaterId, perkId);
        return result.stream().findFirst();
    }

    public Inventory update(Inventory inv) {
        String sql = """
                UPDATE inventories
                SET stock = ?, status = ?
                WHERE theater_id = ? AND perk_id = ?
                RETURNING *
            """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                inv.getStock(),
                inv.getStatus().name(),
                inv.getTheaterId(),
                inv.getPerkId()
        );
    }

    public void delete(Long theaterId, Long perkId) {
        jdbcTemplate.update("DELETE FROM inventories WHERE theater_id = ? AND perk_id = ?", theaterId, perkId);
    }

    public Optional<Inventory> findByPerkId(Long perkId) {
        String sql = "SELECT * FROM inventories WHERE perk_id = ?";
        return jdbcTemplate.query(sql, rowMapper, perkId).stream().findFirst();
    }
}

