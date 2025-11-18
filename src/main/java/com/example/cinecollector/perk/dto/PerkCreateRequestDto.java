package com.example.cinecollector.perk.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class PerkCreateRequestDto {

    @NotNull
    private Long eventId;

    @NotBlank
    private String name;

    private String type;

    @JsonProperty("limit_per_user")
    private Integer limitPerUser;

    private Integer quantity;

    private String description;
}

