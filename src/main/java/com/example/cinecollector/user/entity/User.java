package com.example.cinecollector.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    private Long userId;
    private String name;
    private String email;
    private String password;
    private Role role;
    private String profileImage;
    private Timestamp createdAt;
}

