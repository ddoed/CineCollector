package com.example.cinecollector.movie.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PerkCollectionListDto {

    @JsonProperty("movie_id")
    private Long movieId;

    @JsonProperty("movie_title")
    private String movieTitle;

    @JsonProperty("movie_image")
    private String movieImage;

    @JsonProperty("collected_count")
    private Integer collectedCount;

    @JsonProperty("total_count")
    private Integer totalCount;

    @JsonProperty("completion_rate")
    private Double completionRate;

    @JsonProperty("perks")
    private List<PerkCollectionItemDto> perks;

    @Getter
    @Builder
    public static class PerkCollectionItemDto {
        @JsonProperty("perk_id")
        private Long perkId;

        @JsonProperty("week_no")
        private Integer weekNo;

        @JsonProperty("name")
        private String name;

        @JsonProperty("type")
        private String type;

        @JsonProperty("image")
        private String image;

        @JsonProperty("collected")
        private Boolean collected;
    }
}

