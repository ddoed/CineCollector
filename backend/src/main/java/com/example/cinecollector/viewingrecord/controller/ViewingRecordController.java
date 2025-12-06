package com.example.cinecollector.viewingrecord.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import com.example.cinecollector.viewingrecord.dto.*;
import com.example.cinecollector.viewingrecord.service.ViewingRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/viewing-records")
@RequiredArgsConstructor
public class ViewingRecordController {

    private final ViewingRecordService viewingRecordService;

    @PostMapping
    public ResponseEntity<ApiResponse<ViewingRecordResponseDto>> createRecord(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ViewingRecordCreateRequestDto dto
    ) {
        Long userId = userDetails.getUser().getUserId();
        ViewingRecordResponseDto response = viewingRecordService.createRecord(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{recordId}")
    public ResponseEntity<ApiResponse<ViewingRecordResponseDto>> updateRecord(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recordId,
            @RequestBody ViewingRecordUpdateRequestDto dto
    ) {
        Long userId = userDetails.getUser().getUserId();
        ViewingRecordResponseDto response = viewingRecordService.updateRecord(userId, recordId, dto);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recordId
    ) {
        Long userId = userDetails.getUser().getUserId();
        viewingRecordService.deleteRecord(userId, recordId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ViewingRecordResponseDto>>> getMyRecords(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        List<ViewingRecordResponseDto> list = viewingRecordService.getMyRecords(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/home")
    public ResponseEntity<ApiResponse<List<HomeViewingRecordDto>>> getHomeRecords() {
        List<HomeViewingRecordDto> list = viewingRecordService.getHomeRecords();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<ViewingRecordStatisticsDto>> getStatistics(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        ViewingRecordStatisticsDto statistics = viewingRecordService.getViewingRecordStatistics(userId);
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<HomeViewingRecordDto>>> getMyViewingRecords(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(value = "movie_title", required = false) String movieTitle
    ) {
        Long userId = userDetails.getUser().getUserId();
        List<HomeViewingRecordDto> list = viewingRecordService.getMyViewingRecords(userId, movieTitle);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}

