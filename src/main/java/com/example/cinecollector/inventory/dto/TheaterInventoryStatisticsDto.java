package com.example.cinecollector.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TheaterInventoryStatisticsDto {

    @JsonProperty("total_perks")
    private Integer totalPerks;

    @JsonProperty("low_stock_count")
    private Integer lowStockCount;

    @JsonProperty("sold_out_count")
    private Integer soldOutCount;
}

