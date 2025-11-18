package com.example.cinecollector.collection.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CollectionUpdateRequestDto {

    private Integer quantity;

    @JsonProperty("obtained_date")
    private LocalDate obtainedDate;
}
