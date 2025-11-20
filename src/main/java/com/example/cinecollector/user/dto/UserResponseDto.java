package com.example.cinecollector.user.dto;

import com.example.cinecollector.user.entity.Role;
import com.example.cinecollector.user.entity.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;

@Getter
@Builder
@AllArgsConstructor
public class UserResponseDto {
    private String name;
    private String email;
    private Role role;

    @JsonProperty("profile_image")
    private String profileImage;

    @JsonProperty("created_at")
    private Timestamp createdAt;

    public static UserResponseDto from(User user) {
        return UserResponseDto.builder()
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
