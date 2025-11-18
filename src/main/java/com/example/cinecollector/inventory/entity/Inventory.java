package com.example.cinecollector.inventory.entity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Inventory {
    private Long theaterId;
    private Long perkId;
    private Integer stock;
    private PerkStatus status;
}

