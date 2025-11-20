package com.example.cinecollector.inventory.dto;

import com.example.cinecollector.inventory.entity.Inventory;
import com.example.cinecollector.inventory.entity.PerkStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InventoryResponseDto {

    private Long theaterId;
    private Long perkId;
    private Integer stock;
    private PerkStatus status;

    public static InventoryResponseDto from(Inventory inv) {
        return InventoryResponseDto.builder()
                .theaterId(inv.getTheaterId())
                .perkId(inv.getPerkId())
                .stock(inv.getStock())
                .status(inv.getStatus())
                .build();
    }
}
