package com.example.cinecollector.movie.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MovieCollectionSummaryDto {
    private Long movieId;
    private String movieTitle;
    private double collectionRate;
}

