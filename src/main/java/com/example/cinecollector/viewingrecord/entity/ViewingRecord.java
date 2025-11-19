package com.example.cinecollector.viewingrecord.entity;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ViewingRecord {

    private Long recordId;
    private Long userId;
    private Long movieId;
    private Long theaterId;
    private LocalDate viewDate;
    private String review;
    private Boolean isPublic;
}

