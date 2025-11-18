package com.example.cinecollector.theater.entity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Theater {
    private Long theaterId;
    private String name;
    private String location;
    private Long managerId;
}
