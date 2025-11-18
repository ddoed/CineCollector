package com.example.cinecollector.inventory.dto;

import com.example.cinecollector.inventory.entity.PerkStatus;
import lombok.Getter;

@Getter
public class InventoryUpdateRequestDto {

    private Integer stock;

    private PerkStatus status;
}
