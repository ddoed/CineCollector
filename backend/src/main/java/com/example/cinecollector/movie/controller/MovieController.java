package com.example.cinecollector.movie.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.movie.dto.MovieResponseDto;
import com.example.cinecollector.movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/movies")
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MovieResponseDto>>> getMovies() {
        return ResponseEntity.ok(ApiResponse.success(movieService.getAllMovie()));
    }
}
