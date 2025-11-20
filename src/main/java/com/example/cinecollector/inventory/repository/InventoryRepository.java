package com.example.cinecollector.inventory.repository;

import com.example.cinecollector.inventory.entity.Inventory;
import com.example.cinecollector.inventory.entity.PerkStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
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

    public List<Inventory> findAllByPerkId(Long perkId) {
        String sql = "SELECT * FROM inventories WHERE perk_id = ? ORDER BY theater_id";
        return jdbcTemplate.query(sql, rowMapper, perkId);
    }

    public List<Inventory> findAllByTheaterId(Long theaterId) {
        String sql = "SELECT * FROM inventories WHERE theater_id = ? ORDER BY perk_id";
        return jdbcTemplate.query(sql, rowMapper, theaterId);
    }

    public List<Map<String, Object>> findInventoryListByTheaterId(Long theaterId, String movieTitle, String perkName) {
        StringBuilder sql = new StringBuilder("""
            SELECT 
                i.perk_id,
                i.stock AS remaining_stock,
                i.status,
                p.name AS perk_name,
                p.limit_per_user,
                p.quantity AS total_stock,
                e.week_no,
                e.title AS event_title,
                e.start_date,
                e.end_date,
                m.movie_id,
                m.title AS movie_title,
                m.image AS movie_image
            FROM inventories i
            JOIN perks p ON i.perk_id = p.perk_id
            JOIN events e ON p.event_id = e.event_id
            JOIN movies m ON e.movie_id = m.movie_id
            WHERE i.theater_id = ?
        """);

        if (movieTitle != null && !movieTitle.trim().isEmpty()) {
            sql.append(" AND m.title ILIKE ?");
        }

        if (perkName != null && !perkName.trim().isEmpty()) {
            sql.append(" AND p.name ILIKE ?");
        }

        sql.append(" ORDER BY e.week_no, p.perk_id");

        if (movieTitle != null && !movieTitle.trim().isEmpty() && perkName != null && !perkName.trim().isEmpty()) {
            return jdbcTemplate.queryForList(sql.toString(), theaterId, "%" + movieTitle + "%", "%" + perkName + "%");
        } else if (movieTitle != null && !movieTitle.trim().isEmpty()) {
            return jdbcTemplate.queryForList(sql.toString(), theaterId, "%" + movieTitle + "%");
        } else if (perkName != null && !perkName.trim().isEmpty()) {
            return jdbcTemplate.queryForList(sql.toString(), theaterId, "%" + perkName + "%");
        }
        return jdbcTemplate.queryForList(sql.toString(), theaterId);
    }

    public Map<String, Object> getInventoryStatistics(Long theaterId) {
        String sql = """
            SELECT 
                COUNT(*) AS total_perks,
                COUNT(CASE WHEN i.status = 'LOW' THEN 1 END) AS low_stock_count,
                COUNT(CASE WHEN i.status = 'SOLD_OUT' THEN 1 END) AS sold_out_count
            FROM inventories i
            WHERE i.theater_id = ?
        """;

        return jdbcTemplate.queryForMap(sql, theaterId);
    }
}

