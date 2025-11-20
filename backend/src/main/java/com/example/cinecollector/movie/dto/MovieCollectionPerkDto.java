package com.example.cinecollector.movie.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MovieCollectionPerkDto {
    private Long perkId;
    private String perkName;
    private String type;
    private boolean collected;
}
