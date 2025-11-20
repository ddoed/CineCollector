package com.example.cinecollector.event.repository;

import com.example.cinecollector.event.entity.Event;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
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
            INSERT INTO events(movie_id, creator_id, title, start_date, end_date, week_no)
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING event_id, movie_id, creator_id, title, start_date, end_date, week_no
            """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                e.getMovieId(), e.getCreatorId(), e.getTitle(),
                e.getStartDate(), e.getEndDate(), e.getWeekNo()
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

    public List<Event> findAllWithFilters(String status, String movieTitle) {
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

        if (movieTitle != null && !movieTitle.trim().isEmpty()) {
            sql.append(" AND m.title ILIKE ?");
        }

        sql.append(" ORDER BY e.start_date DESC, e.event_id DESC");

        if (status != null && !status.isEmpty() && !status.equals("전체")) {
            LocalDate today = LocalDate.now();
            if (status.equals("진행 중")) {
                if (movieTitle != null && !movieTitle.trim().isEmpty()) {
                    return jdbcTemplate.query(sql.toString(), rowMapper, today, today, "%" + movieTitle + "%");
                }
                return jdbcTemplate.query(sql.toString(), rowMapper, today, today);
            } else if (status.equals("예정")) {
                if (movieTitle != null && !movieTitle.trim().isEmpty()) {
                    return jdbcTemplate.query(sql.toString(), rowMapper, today, "%" + movieTitle + "%");
                }
                return jdbcTemplate.query(sql.toString(), rowMapper, today);
            } else if (status.equals("종료")) {
                if (movieTitle != null && !movieTitle.trim().isEmpty()) {
                    return jdbcTemplate.query(sql.toString(), rowMapper, today, "%" + movieTitle + "%");
                }
                return jdbcTemplate.query(sql.toString(), rowMapper, today);
            }
        }

        if (movieTitle != null && !movieTitle.trim().isEmpty()) {
            return jdbcTemplate.query(sql.toString(), rowMapper, "%" + movieTitle + "%");
        }

        return jdbcTemplate.query(sql.toString(), rowMapper);
    }
}

