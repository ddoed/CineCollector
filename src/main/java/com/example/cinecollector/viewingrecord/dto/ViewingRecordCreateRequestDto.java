package com.example.cinecollector.viewingrecord.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class ViewingRecordCreateRequestDto {

    @NotNull
    @JsonProperty("movie_id")
    private Long movieId;

    @NotNull
    @JsonProperty("theater_id")
    private Long theaterId;

    @JsonProperty("view_date")
    private LocalDate viewDate;

    private String review;

    @JsonProperty("is_public")
    private Boolean isPublic;
}

