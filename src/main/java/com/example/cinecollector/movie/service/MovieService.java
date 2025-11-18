package com.example.cinecollector.movie.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.movie.dto.MovieCreateRequestDto;
import com.example.cinecollector.movie.dto.MovieResponseDto;
import com.example.cinecollector.movie.dto.MovieUpdateRequestDto;
import com.example.cinecollector.movie.entity.Movie;
import com.example.cinecollector.movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieResponseDto createMovie(MovieCreateRequestDto dto) {

        Movie movie = Movie.builder()
                .title(dto.getTitle())
                .releaseDate(dto.getReleaseDate())
                .genre(dto.getGenre())
                .duration(dto.getDuration())
                .build();

        Movie saved = movieRepository.save(movie);

        return MovieResponseDto.from(saved);
    }

    public MovieResponseDto getMovie(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MOVIE_NOT_FOUND));

        return MovieResponseDto.from(movie);
    }

    public List<MovieResponseDto> getAllMovie() {
        return movieRepository.findAll().stream()
                .map(MovieResponseDto::from)
                .toList();
    }

    public MovieResponseDto updateMovie(Long movieId, MovieUpdateRequestDto dto) {

        Movie original = movieRepository.findById(movieId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MOVIE_NOT_FOUND));

        String title = dto.getTitle() != null ? dto.getTitle() : original.getTitle();
        LocalDate releaseDate = dto.getReleaseDate() != null ? dto.getReleaseDate() : original.getReleaseDate();
        String genre = dto.getGenre() != null ? dto.getGenre() : original.getGenre();
        Integer duration = dto.getDuration() != null ? dto.getDuration() : original.getDuration();

        Movie updatedEntity = Movie.builder()
                .movieId(original.getMovieId())
                .title(title)
                .releaseDate(releaseDate)
                .genre(genre)
                .duration(duration)
                .build();

        movieRepository.update(updatedEntity);

        return MovieResponseDto.from(updatedEntity);
    }

    public void deleteMovie(Long movieId) {
        movieRepository.delete(movieId);
    }
}


