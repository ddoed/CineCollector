package com.example.cinecollector.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class UserUpdateRequestDto {

    private String name;

    @JsonProperty("profile_image")
    private String profileImage;
}

