package com.example.cinecollector.event.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class EventCreateRequestDto {

    @NotNull
    private Long movieId;

    @NotBlank(message = "제목은 필수 값 입니다.")
    private String title;

    @JsonProperty("start_date")
    private LocalDate startDate;

    @JsonProperty("end_date")
    private LocalDate endDate;

    @JsonProperty("week_no")
    private Integer weekNo;
}

