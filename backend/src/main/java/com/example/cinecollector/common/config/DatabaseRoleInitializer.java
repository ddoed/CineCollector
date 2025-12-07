package com.example.cinecollector.common.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class DatabaseRoleInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            // 역할 생성 (이미 존재하면 무시)
            createRoleIfNotExists("collector_role");
            createRoleIfNotExists("theater_role");
            createRoleIfNotExists("creator_role");
            createRoleIfNotExists("admin_role");
            
            log.info("Database roles initialized successfully");
        } catch (Exception e) {
            log.warn("Failed to initialize database roles: {}", e.getMessage());
        }
    }

    private void createRoleIfNotExists(String roleName) {
        try {
            // PostgreSQL에서 역할이 존재하는지 확인
            String checkSql = "SELECT COUNT(*) FROM pg_roles WHERE rolname = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, roleName);
            
            if (count == null || count == 0) {
                // 역할이 없으면 생성
                String createSql = "CREATE ROLE " + roleName;
                jdbcTemplate.execute(createSql);
                log.info("Role '{}' created successfully", roleName);
            } else {
                log.debug("Role '{}' already exists", roleName);
            }
        } catch (Exception e) {
            log.warn("Failed to create role '{}': {}", roleName, e.getMessage());
        }
    }
}

