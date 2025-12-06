package com.example.cinecollector.movie.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import com.example.cinecollector.movie.dto.*;
import com.example.cinecollector.movie.service.MovieCollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/movies")
public class MovieCollectionController {

    private final MovieCollectionService service;

    @GetMapping("/{movieId}/collection")
    public ResponseEntity<ApiResponse<MovieCollectionResponseDto>> getMovieCollection(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long movieId
    ) {
        Long userId = userDetails.getUser().getUserId();

        MovieCollectionResponseDto dto = service.getMovieCollection(userId, movieId);

        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/my/collection")
    public ResponseEntity<ApiResponse<List<MovieCollectionSummaryDto>>> getMyMovieCollections(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        List<MovieCollectionSummaryDto> list = service.getMyCollectedMovies(userId);

        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/perk-collection/statistics")
    public ResponseEntity<ApiResponse<PerkCollectionStatisticsDto>> getPerkCollectionStatistics(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        PerkCollectionStatisticsDto statistics = service.getPerkCollectionStatistics(userId);
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    @GetMapping("/perk-collection/list")
    public ResponseEntity<ApiResponse<List<PerkCollectionListDto>>> getPerkCollectionList(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(value = "movie_title", required = false) String movieTitle,
            @RequestParam(required = false, defaultValue = "전체") String filter
    ) {
        Long userId = userDetails.getUser().getUserId();
        List<PerkCollectionListDto> list = service.getPerkCollectionList(userId, movieTitle, filter);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}

