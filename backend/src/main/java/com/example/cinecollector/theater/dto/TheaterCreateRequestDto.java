package com.example.cinecollector.theater.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class TheaterCreateRequestDto {

    @NotBlank(message = "이름은 필수입니다.")
    private String name;

    private String location;
}
