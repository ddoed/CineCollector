package com.example.cinecollector.event.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class EventDetailDto {

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

    @JsonProperty("week_no")
    private Integer weekNo;

    @JsonProperty("image")
    private String image;

    @JsonProperty("perks")
    private List<PerkDetailDto> perks;

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
    public static class PerkDetailDto {
        @JsonProperty("perk_id")
        private Long perkId;

        @JsonProperty("name")
        private String name;

        @JsonProperty("type")
        private String type;

        @JsonProperty("description")
        private String description;

        @JsonProperty("limit_per_user")
        private Integer limitPerUser;

        @JsonProperty("quantity")
        private Integer quantity;

        @JsonProperty("image")
        private String image;

        @JsonProperty("theaters")
        private List<TheaterInventoryDto> theaters;
    }

    @Getter
    @Builder
    public static class TheaterInventoryDto {
        @JsonProperty("theater_id")
        private Long theaterId;

        @JsonProperty("name")
        private String name;

        @JsonProperty("location")
        private String location;

        @JsonProperty("stock")
        private Integer stock;

        @JsonProperty("status")
        private String status; // "재고 있음", "소진 완료", "재고 부족"

        @JsonProperty("status_message")
        private String statusMessage; // "45개 남음", "소진 완료" 등
    }
}

