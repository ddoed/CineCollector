package com.example.cinecollector.event.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class EventWithPerkCreateRequestDto {

    @NotNull
    @JsonProperty("movie_id")
    private Long movieId;

    @NotBlank
    private String title;

    @JsonProperty("start_date")
    private LocalDate startDate;

    @JsonProperty("end_date")
    private LocalDate endDate;

    @JsonProperty("week_no")
    private Integer weekNo;

    @JsonProperty("event_image")
    private String eventImage;

    @JsonProperty("perk")
    private PerkInfoDto perk;

    @JsonProperty("is_public")
    private Boolean isPublic;

    @JsonProperty("theater_ids")
    private List<Long> theaterIds;

    @Getter
    public static class PerkInfoDto {
        @NotBlank
        private String name;

        private String type;

        @JsonProperty("total_quantity")
        private Integer totalQuantity;

        @JsonProperty("limit_per_user")
        private Integer limitPerUser;

        private String description;

        @JsonProperty("perk_image")
        private String perkImage;
    }
}

