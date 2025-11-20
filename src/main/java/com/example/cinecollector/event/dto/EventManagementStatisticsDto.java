package com.example.cinecollector.event.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EventManagementStatisticsDto {

    @JsonProperty("total_events")
    private Integer totalEvents;

    @JsonProperty("ongoing_events")
    private Integer ongoingEvents;

    @JsonProperty("total_perk_quantity")
    private Integer totalPerkQuantity;
}

