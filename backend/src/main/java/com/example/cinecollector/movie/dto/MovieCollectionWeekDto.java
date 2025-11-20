package com.example.cinecollector.movie.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MovieCollectionWeekDto {
    private Integer weekNo;
    private String category;
    private boolean weekCollected;
    private List<MovieCollectionCreatorDto> creators;
}
