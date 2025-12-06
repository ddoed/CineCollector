package com.example.cinecollector.event.repository;

import com.example.cinecollector.event.entity.Event;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class EventRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Event> rowMapper = (rs, rowNum) ->
            Event.builder()
                    .eventId(rs.getLong("event_id"))
                    .movieId(rs.getLong("movie_id"))
                    .creatorId(rs.getLong("creator_id"))
                    .title(rs.getString("title"))
                    .startDate(rs.getObject("start_date", java.time.LocalDate.class))
                    .endDate(rs.getObject("end_date", java.time.LocalDate.class))
                    .weekNo(rs.getObject("week_no", Integer.class))
                    .image(rs.getString("image"))
                    .build();

    public Event save(Event e) {
        String sql = """
            INSERT INTO events(movie_id, creator_id, title, start_date, end_date, week_no, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING event_id, movie_id, creator_id, title, start_date, end_date, week_no, image
            """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                e.getMovieId(), e.getCreatorId(), e.getTitle(),
                e.getStartDate(), e.getEndDate(), e.getWeekNo(), e.getImage()
        );
    }

    public Optional<Event> findById(Long id) {
        String sql = "SELECT * FROM events WHERE event_id = ?";
        List<Event> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.stream().findFirst();
    }

    public Event update(Event e) {
        String sql = """
            UPDATE events 
            SET title = ?, start_date = ?, end_date = ?, week_no = ?
            WHERE event_id = ?
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                e.getTitle(),
                e.getStartDate(),
                e.getEndDate(),
                e.getWeekNo(),
                e.getEventId()
        );
    }

    public void delete(Long id) {
        jdbcTemplate.update("DELETE FROM events WHERE event_id = ?", id);
    }

    public List<Event> findAll() {
        String sql = "SELECT * FROM events ORDER BY event_id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<Event> findAllWithFilters(String status, String movieTitle, String eventTitle) {
        StringBuilder sql = new StringBuilder("""
            SELECT e.*
            FROM events e
            JOIN movies m ON e.movie_id = m.movie_id
            WHERE 1=1
        """);

        if (status != null && !status.isEmpty() && !status.equals("전체")) {
            switch (status) {
                case "진행 중" -> sql.append(" AND e.start_date <= ? AND e.end_date >= ?");
                case "예정" -> sql.append(" AND e.start_date > ?");
                case "종료" -> sql.append(" AND e.end_date < ?");
            }
        }

        // 영화 제목과 이벤트 제목 검색 (OR 조건)
        boolean hasMovieTitle = movieTitle != null && !movieTitle.trim().isEmpty();
        boolean hasEventTitle = eventTitle != null && !eventTitle.trim().isEmpty();
        
        if (hasMovieTitle || hasEventTitle) {
            sql.append(" AND (");
            boolean first = true;
            if (hasMovieTitle) {
                sql.append(" m.title ILIKE ?");
                first = false;
            }
            if (hasEventTitle) {
                if (!first) {
                    sql.append(" OR");
                }
                sql.append(" e.title ILIKE ?");
            }
            sql.append(" )");
        }

        sql.append(" ORDER BY e.start_date DESC, e.event_id DESC");

        List<Object> params = new java.util.ArrayList<>();

        if (status != null && !status.isEmpty() && !status.equals("전체")) {
            LocalDate today = LocalDate.now();
            params.add(today);
            if (status.equals("진행 중")) {
                params.add(today);
            }
        }

        if (hasMovieTitle) {
            params.add("%" + movieTitle + "%");
        }

        if (hasEventTitle) {
            params.add("%" + eventTitle + "%");
        }

        if (params.isEmpty()) {
            return jdbcTemplate.query(sql.toString(), rowMapper);
        }

        return jdbcTemplate.query(sql.toString(), rowMapper, params.toArray());
    }

    public List<Event> findAllByCreatorId(Long creatorId) {
        String sql = "SELECT * FROM events WHERE creator_id = ? ORDER BY event_id DESC";
        return jdbcTemplate.query(sql, rowMapper, creatorId);
    }

    public List<Event> findAllByCreatorIdWithFilters(Long creatorId, String status, String movieTitle, String eventTitle) {
        StringBuilder sql = new StringBuilder("""
            SELECT e.*
            FROM events e
            JOIN movies m ON e.movie_id = m.movie_id
            WHERE e.creator_id = ?
        """);

        if (status != null && !status.isEmpty() && !status.equals("전체")) {
            switch (status) {
                case "진행 중" -> sql.append(" AND e.start_date <= ? AND e.end_date >= ?");
                case "예정" -> sql.append(" AND e.start_date > ?");
                case "종료" -> sql.append(" AND e.end_date < ?");
            }
        }

        if (movieTitle != null && !movieTitle.trim().isEmpty()) {
            sql.append(" AND m.title ILIKE ?");
        }

        if (eventTitle != null && !eventTitle.trim().isEmpty()) {
            sql.append(" AND e.title ILIKE ?");
        }

        sql.append(" ORDER BY e.start_date DESC, e.event_id DESC");

        List<Object> params = new java.util.ArrayList<>();
        params.add(creatorId);

        if (status != null && !status.isEmpty() && !status.equals("전체")) {
            LocalDate today = LocalDate.now();
            params.add(today);
            if (status.equals("진행 중")) {
                params.add(today);
            }
        }

        if (movieTitle != null && !movieTitle.trim().isEmpty()) {
            params.add("%" + movieTitle + "%");
        }

        if (eventTitle != null && !eventTitle.trim().isEmpty()) {
            params.add("%" + eventTitle + "%");
        }

        return jdbcTemplate.query(sql.toString(), rowMapper, params.toArray());
    }

    public Map<String, Object> getEventManagementStatistics(Long creatorId) {
        String sql = """
            SELECT 
                COUNT(*) AS total_events,
                COUNT(CASE WHEN e.start_date <= CURRENT_DATE AND e.end_date >= CURRENT_DATE THEN 1 END) AS ongoing_events,
                COALESCE(SUM(p.quantity), 0) AS total_perk_quantity
            FROM events e
            LEFT JOIN perks p ON p.event_id = e.event_id
            WHERE e.creator_id = ?
        """;

        return jdbcTemplate.queryForMap(sql, creatorId);
    }
}

