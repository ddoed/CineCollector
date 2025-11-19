package com.example.cinecollector.movie.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MovieCollectionResponseDto {
    private Long movieId;
    private String movieTitle;
    private double collectionRate;
    private List<MovieCollectionWeekDto> weeks;
}
