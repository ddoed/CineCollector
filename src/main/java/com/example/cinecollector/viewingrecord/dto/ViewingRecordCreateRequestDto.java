package com.example.cinecollector.viewingrecord.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

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

    private Float rating;

    @JsonProperty("image_urls")
    private List<String> imageUrls;

    @JsonProperty("perk_ids")
    private List<Long> perkIds;
}

