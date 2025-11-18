package com.example.cinecollector.perk.dto;

import com.example.cinecollector.perk.entity.Perk;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PerkResponseDto {

    private Long perkId;
    private Long eventId;
    private String name;
    private String type;

    @JsonProperty("limit_per_user")
    private Integer limitPerUser;

    private Integer quantity;
    private String description;

    public static PerkResponseDto from(Perk perk) {
        return PerkResponseDto.builder()
                .perkId(perk.getPerkId())
                .eventId(perk.getEventId())
                .name(perk.getName())
                .type(perk.getType())
                .limitPerUser(perk.getLimitPerUser())
                .quantity(perk.getQuantity())
                .description(perk.getDescription())
                .build();
    }
}

