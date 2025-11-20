package com.example.cinecollector.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.List;

@Getter
public class TheaterSelectionDto {

    @NotNull
    @JsonProperty("perk_id")
    private Long perkId;

    @NotNull
    @JsonProperty("theater_ids")
    private List<Long> theaterIds;
}

