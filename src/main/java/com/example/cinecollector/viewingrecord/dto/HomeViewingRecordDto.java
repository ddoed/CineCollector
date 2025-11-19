package com.example.cinecollector.viewingrecord.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class HomeViewingRecordDto {

    @JsonProperty("record_id")
    private Long recordId;

    @JsonProperty("user")
    private UserInfoDto user;

    @JsonProperty("time_ago")
    private String timeAgo;

    @JsonProperty("movie")
    private MovieInfoDto movie;

    @JsonProperty("rating")
    private Float rating;

    @JsonProperty("view_date")
    private LocalDate viewDate;

    @JsonProperty("theater_name")
    private String theaterName;

    @JsonProperty("review")
    private String review;

    @JsonProperty("images")
    private List<String> images;

    @JsonProperty("perks")
    private List<PerkInfoDto> perks;

    @Getter
    @Builder
    public static class UserInfoDto {
        @JsonProperty("user_id")
        private Long userId;

        @JsonProperty("name")
        private String name;

        @JsonProperty("profile_image")
        private String profileImage;
    }

    @Getter
    @Builder
    public static class MovieInfoDto {
        @JsonProperty("movie_id")
        private Long movieId;

        @JsonProperty("title")
        private String title;

        @JsonProperty("movie_image")
        private String movieImage;
    }

    @Getter
    @Builder
    public static class PerkInfoDto {
        @JsonProperty("perk_id")
        private Long perkId;

        @JsonProperty("name")
        private String name;
    }
}

