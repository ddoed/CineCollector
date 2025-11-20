package com.example.cinecollector.perkapplication.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class PerkApplicationResponseDto {

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("perk_id")
    private Long perkId;

    @JsonProperty("theater_id")
    private Long theaterId;

    @JsonProperty("quantity")
    private Integer quantity;

    @JsonProperty("obtained_date")
    private LocalDate obtainedDate;
}

