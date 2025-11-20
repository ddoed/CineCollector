package com.example.cinecollector.perkapplication.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class PerkApplicationRequestDto {

    @NotNull
    @JsonProperty("perk_id")
    private Long perkId;

    @NotNull
    @JsonProperty("theater_id")
    private Long theaterId;

    @NotNull
    @Min(value = 1, message = "신청 수량은 1개 이상이어야 합니다.")
    private Integer quantity;
}

