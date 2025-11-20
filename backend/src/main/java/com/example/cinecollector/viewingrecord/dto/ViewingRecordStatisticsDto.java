package com.example.cinecollector.viewingrecord.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ViewingRecordStatisticsDto {

    @JsonProperty("total_count")
    private Integer totalCount;

    @JsonProperty("this_month_count")
    private Integer thisMonthCount;

    @JsonProperty("average_rating")
    private Double averageRating;
}

