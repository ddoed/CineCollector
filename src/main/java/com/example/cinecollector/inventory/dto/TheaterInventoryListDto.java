package com.example.cinecollector.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class TheaterInventoryListDto {

    @JsonProperty("perk_id")
    private Long perkId;

    @JsonProperty("movie")
    private MovieInfoDto movie;

    @JsonProperty("perk_name")
    private String perkName;

    @JsonProperty("week_no")
    private Integer weekNo;

    @JsonProperty("event_title")
    private String eventTitle;

    @JsonProperty("stock_status")
    private String stockStatus;

    @JsonProperty("remaining_stock")
    private Integer remainingStock;

    @JsonProperty("total_stock")
    private Integer totalStock;

    @JsonProperty("start_date")
    private LocalDate startDate;

    @JsonProperty("end_date")
    private LocalDate endDate;

    @JsonProperty("limit_per_user")
    private Integer limitPerUser;

    @JsonProperty("applicant_count")
    private Integer applicantCount;

    @Getter
    @Builder
    public static class MovieInfoDto {
        @JsonProperty("movie_id")
        private Long movieId;

        @JsonProperty("title")
        private String title;

        @JsonProperty("image")
        private String image;
    }
}

