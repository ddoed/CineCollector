package com.example.cinecollector.movie.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class MovieUpdateRequestDto {

    private String title;

    @JsonProperty("release_date")
    private LocalDate releaseDate;

    private String genre;

    private Integer duration;
}
