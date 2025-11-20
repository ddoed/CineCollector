package com.example.cinecollector.movie.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.movie.dto.MovieCreateRequestDto;
import com.example.cinecollector.movie.dto.MovieResponseDto;
import com.example.cinecollector.movie.dto.MovieUpdateRequestDto;
import com.example.cinecollector.movie.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/movies")
public class MovieController {

    private final MovieService movieService;

    @PostMapping
    public ResponseEntity<ApiResponse<MovieResponseDto>> createMovie(@Valid @RequestBody MovieCreateRequestDto dto) {
        MovieResponseDto created = movieService.createMovie(dto);
        return ResponseEntity.ok(ApiResponse.success(created));
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<ApiResponse<MovieResponseDto>> getMovie(@PathVariable Long movieId) {
        MovieResponseDto movie = movieService.getMovie(movieId);
        return ResponseEntity.ok(ApiResponse.success(movie));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MovieResponseDto>>> getMovies() {
        return ResponseEntity.ok(ApiResponse.success(movieService.getAllMovie()));
    }

    @PatchMapping("/{movieId}")
    public ResponseEntity<ApiResponse<MovieResponseDto>> updateMovie(
            @PathVariable Long movieId,
            @Valid @RequestBody MovieUpdateRequestDto dto
    ) {
        MovieResponseDto updated = movieService.updateMovie(movieId, dto);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable Long movieId) {
        movieService.deleteMovie(movieId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
