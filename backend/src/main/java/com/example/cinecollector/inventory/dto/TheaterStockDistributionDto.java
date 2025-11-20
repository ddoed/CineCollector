package com.example.cinecollector.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class TheaterStockDistributionDto {

    @JsonProperty("perk_id")
    private Long perkId;

    @JsonProperty("perk_name")
    private String perkName;

    @JsonProperty("perk_type")
    private String perkType;

    @JsonProperty("movie")
    private MovieInfoDto movie;

    @JsonProperty("total_quantity")
    private Integer totalQuantity;

    @JsonProperty("theaters")
    private List<TheaterStockDto> theaters;

    @Getter
    @Builder
    public static class MovieInfoDto {
        @JsonProperty("movie_id")
        private Long movieId;

        @JsonProperty("title")
        private String title;
    }

    @Getter
    @Builder
    public static class TheaterStockDto {
        @JsonProperty("theater_id")
        private Long theaterId;

        @JsonProperty("name")
        private String name;

        @JsonProperty("location")
        private String location;

        @JsonProperty("current_stock")
        private Integer currentStock;
    }
}

