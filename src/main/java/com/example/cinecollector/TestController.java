package com.example.cinecollector;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/test-db")
    public String test() {
        Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        return "DB OK: " + result;
    }
}
