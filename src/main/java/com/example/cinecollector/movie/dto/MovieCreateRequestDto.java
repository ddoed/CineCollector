package com.example.cinecollector.movie.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class MovieCreateRequestDto {

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @JsonProperty("release_date")
    private LocalDate releaseDate;

    private String genre;

    private Integer duration;
}

