package com.example.cinecollector.event.dto;

import com.example.cinecollector.event.entity.Event;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EventResponseDto {
    private Long eventId;
    private Long movieId;
    private Long creatorId;
    private String title;

    @JsonProperty("start_date")
    private java.time.LocalDate startDate;

    @JsonProperty("end_date")
    private java.time.LocalDate endDate;

    @JsonProperty("week_no")
    private Integer weekNo;

    public static EventResponseDto from(Event event) {
        return EventResponseDto.builder()
                .eventId(event.getEventId())
                .movieId(event.getMovieId())
                .creatorId(event.getCreatorId())
                .title(event.getTitle())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .weekNo(event.getWeekNo())
                .build();
    }
}
