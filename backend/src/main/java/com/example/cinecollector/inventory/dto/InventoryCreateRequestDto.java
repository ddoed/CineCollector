package com.example.cinecollector.inventory.dto;

import com.example.cinecollector.inventory.entity.PerkStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class InventoryCreateRequestDto {

    @NotNull
    @JsonProperty("theater_id")
    private Long theaterId;

    @NotNull
    @JsonProperty("perk_id")
    private Long perkId;

    private Integer stock;

    private PerkStatus status;
}
