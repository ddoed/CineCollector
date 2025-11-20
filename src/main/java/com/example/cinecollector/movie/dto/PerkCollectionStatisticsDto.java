package com.example.cinecollector.movie.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PerkCollectionStatisticsDto {

    @JsonProperty("total_perks")
    private Integer totalPerks;

    @JsonProperty("collected_perks")
    private Integer collectedPerks;

    @JsonProperty("collection_rate")
    private Double collectionRate;

    @JsonProperty("overall_progress")
    private Double overallProgress;
}

