package com.example.cinecollector.collection.entity;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class Collection {

    private Long userId;
    private Long perkId;
    private Integer quantity;
    private LocalDate obtainedDate;
}
