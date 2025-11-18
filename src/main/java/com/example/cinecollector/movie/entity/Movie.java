package com.example.cinecollector.movie.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Movie {
    private Long movieId;
    private String title;
    private LocalDate releaseDate;
    private String genre;
    private Integer duration;
}

