package com.example.cinecollector.perk.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class PerkUpdateRequestDto {

    private String name;
    private String type;

    @JsonProperty("limit_per_user")
    private Integer limitPerUser;

    private Integer quantity;
    private String description;
}

