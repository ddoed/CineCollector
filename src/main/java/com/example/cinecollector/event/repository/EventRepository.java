package com.example.cinecollector.event.repository;

import com.example.cinecollector.event.entity.Event;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

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

    public void update(Event e) {
        String sql = """
            UPDATE events 
            SET title = ?, start_date = ?, end_date = ?, week_no = ?
            WHERE event_id = ?
            """;

        jdbcTemplate.update(sql,
                e.getTitle(), e.getStartDate(), e.getEndDate(), e.getWeekNo(), e.getEventId());
    }

    public void delete(Long id) {
        jdbcTemplate.update("DELETE FROM events WHERE event_id = ?", id);
    }

    public List<Event> findAll() {
        String sql = "SELECT * FROM events ORDER BY event_id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }
}

