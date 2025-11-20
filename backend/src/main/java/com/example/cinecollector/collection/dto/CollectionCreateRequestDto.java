package com.example.cinecollector.collection.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CollectionCreateRequestDto {

    @NotNull(message = "perk_id는 필수입니다.")
    @JsonProperty("perk_id")
    private Long perkId;

    private Integer quantity;

    @JsonProperty("obtained_date")
    private LocalDate obtainedDate;
}
