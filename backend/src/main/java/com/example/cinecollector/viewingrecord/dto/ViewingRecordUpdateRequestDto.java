package com.example.cinecollector.viewingrecord.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class ViewingRecordUpdateRequestDto {

    @JsonProperty("view_date")
    private LocalDate viewDate;

    @JsonProperty("theater_id")
    private Long theaterId;

    private String review;

    @JsonProperty("is_public")
    private Boolean isPublic;

    private Float rating;
}
