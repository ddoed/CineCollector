package com.example.cinecollector.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.List;

@Getter
public class StockDistributionRequestDto {

    @JsonProperty("theater_stocks")
    private List<TheaterStockItemDto> theaterStocks;

    @Getter
    public static class TheaterStockItemDto {
        @JsonProperty("theater_id")
        private Long theaterId;

        @JsonProperty("stock")
        private Integer stock;
    }
}

