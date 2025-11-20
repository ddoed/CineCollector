package com.example.cinecollector.perk.entity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Perk {
    private Long perkId;
    private Long eventId;
    private String name;
    private String type;
    private Integer limitPerUser;
    private Integer quantity;
    private String description;
    private String image;
}

