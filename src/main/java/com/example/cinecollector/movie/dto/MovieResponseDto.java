package com.example.cinecollector.movie.dto;

import com.example.cinecollector.movie.entity.Movie;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovieResponseDto {
    private Long movieId;
    private String title;
    private LocalDate releaseDate;
    private String genre;
    private Integer duration;

    public static MovieResponseDto from(Movie movie) {
        return MovieResponseDto.builder()
                .movieId(movie.getMovieId())
                .title(movie.getTitle())
                .releaseDate(movie.getReleaseDate())
                .genre(movie.getGenre())
                .duration(movie.getDuration())
                .build();
    }
}

