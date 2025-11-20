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

    private final RowMapper<User> rowMapper = (rs, rowNum) ->
            User.builder()
                    .userId(rs.getLong("user_id"))
                    .name(rs.getString("name"))
                    .email(rs.getString("email"))
                    .password(rs.getString("password"))
                    .role(Role.valueOf(rs.getString("role")))
                    .profileImage(rs.getString("profile_image"))
                    .createdAt(rs.getTimestamp("created_at"))
                    .build();

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        List<User> result = jdbcTemplate.query(sql, rowMapper, email);
        return result.stream().findFirst();
    }

    public User save(User user) {
        String sql = """
                INSERT INTO users(name, email, password, role, profile_image)
                VALUES (?, ?, ?, ?, ?)
                RETURNING user_id, name, email, password, role, profile_image, created_at
                """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole().name(),
                user.getProfileImage()
        );
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE user_id = ?";
        List<User> users = jdbcTemplate.query(sql, rowMapper, id);
        return users.stream().findFirst();
    }

    public User update(User user) {
        String sql = """
            UPDATE users
            SET name = ?, profile_image = ?
            WHERE user_id = ?
            RETURNING *
        """;

        return jdbcTemplate.queryForObject(sql, rowMapper,
                user.getName(),
                user.getProfileImage(),
                user.getUserId()
        );
    }
}

