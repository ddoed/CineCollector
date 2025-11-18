package com.example.cinecollector.user.dto;

import com.example.cinecollector.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserResponseDto {
    private String name;
    private String email;
    private Role role;
}
