package com.example.cinecollector.user.repository;

import com.example.cinecollector.user.entity.Role;
import com.example.cinecollector.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<User> userRowMapper = (rs, rowNum) ->
            User.builder()
                    .userId(rs.getLong("user_id"))
                    .name(rs.getString("name"))
                    .email(rs.getString("email"))
                    .password(rs.getString("password"))
                    .role(Role.valueOf(rs.getString("role")))
                    .build();

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        List<User> result = jdbcTemplate.query(sql, userRowMapper, email);
        return result.stream().findFirst();
    }

    public User save(User user) {
        String sql = """
                INSERT INTO users(name, email, password, role)
                VALUES (?, ?, ?, ?)
                RETURNING user_id, name, email, password, role
                """;

        return jdbcTemplate.queryForObject(sql, userRowMapper,
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole().name()
        );
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE user_id = ?";
        List<User> users = jdbcTemplate.query(sql, userRowMapper, id);
        return users.stream().findFirst();
    }
}

