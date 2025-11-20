package com.example.cinecollector.event.entity;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class Event {
    private Long eventId;
    private Long movieId;
    private Long creatorId;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer weekNo;
    private String image;
}
