package com.example.cinecollector.event.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class EventListDto {

    @JsonProperty("event_id")
    private Long eventId;

    @JsonProperty("movie")
    private MovieInfoDto movie;

    @JsonProperty("title")
    private String title;

    @JsonProperty("status")
    private String status; // "진행 중", "예정", "종료"

    @JsonProperty("start_date")
    private LocalDate startDate;

    @JsonProperty("end_date")
    private LocalDate endDate;

    @JsonProperty("perks")
    private List<PerkSummaryDto> perks;

    @JsonProperty("theater_count")
    private Integer theaterCount;

    @Getter
    @Builder
    public static class MovieInfoDto {
        @JsonProperty("movie_id")
        private Long movieId;

        @JsonProperty("title")
        private String title;

        @JsonProperty("image")
        private String image; // 스키마에 없으므로 null
    }

    @Getter
    @Builder
    public static class PerkSummaryDto {
        @JsonProperty("perk_id")
        private Long perkId;

        @JsonProperty("name")
        private String name;

        @JsonProperty("type")
        private String type;
    }
}

