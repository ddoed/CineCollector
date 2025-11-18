package com.example.cinecollector.theater.dto;

import com.example.cinecollector.theater.entity.Theater;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TheaterResponseDto {

    private Long theaterId;
    private String name;
    private String location;
    private Long managerId;

    public static TheaterResponseDto from(Theater t) {
        return TheaterResponseDto.builder()
                .theaterId(t.getTheaterId())
                .name(t.getName())
                .location(t.getLocation())
                .managerId(t.getManagerId())
                .build();
    }
}
