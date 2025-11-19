package com.example.cinecollector.movie.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MovieCollectionCreatorDto {
    private Long creatorId;
    private String creatorName;
    private List<MovieCollectionPerkDto> perks;
}
