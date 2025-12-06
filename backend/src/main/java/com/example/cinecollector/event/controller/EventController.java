package com.example.cinecollector.event.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import com.example.cinecollector.event.dto.*;
import com.example.cinecollector.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponseDto>> createEvent(
            @Valid @RequestBody EventCreateRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        EventResponseDto responseDto = eventService.createEvent(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> getAllEvent() {
        return ResponseEntity.ok(ApiResponse.success(eventService.getAllEvent()));
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<EventListDto>>> getEventList(
            @RequestParam(required = false, defaultValue = "전체") String status,
            @RequestParam(value = "movie_title", required = false) String movieTitle,
            @RequestParam(value = "event_title", required = false) String eventTitle
    ) {
        List<EventListDto> list = eventService.getEventList(status, movieTitle, eventTitle);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<ApiResponse<EventResponseDto>> getEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getEvent(eventId)));
    }

    @GetMapping("/{eventId}/detail")
    public ResponseEntity<ApiResponse<EventDetailDto>> getEventDetail(@PathVariable Long eventId) {
        EventDetailDto detail = eventService.getEventDetail(eventId);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    @PatchMapping("/{eventId}")
    public ResponseEntity<ApiResponse<EventResponseDto>> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody EventUpdateRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        return ResponseEntity.ok(ApiResponse.success(eventService.updateEvent(userId, eventId, dto)));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long eventId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        eventService.deleteEvent(userId, eventId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/management/statistics")
    public ResponseEntity<ApiResponse<EventManagementStatisticsDto>> getEventManagementStatistics(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long creatorId = userDetails.getUser().getUserId();
        EventManagementStatisticsDto statistics = eventService.getEventManagementStatistics(creatorId);
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    @GetMapping("/management/list")
    public ResponseEntity<ApiResponse<List<EventListDto>>> getEventManagementList(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false, defaultValue = "전체") String status,
            @RequestParam(required = false) String movieTitle,
            @RequestParam(required = false) String eventTitle
    ) {
        Long creatorId = userDetails.getUser().getUserId();
        List<EventListDto> list = eventService.getEventManagementList(creatorId, status, movieTitle, eventTitle);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/with-perk")
    public ResponseEntity<ApiResponse<EventResponseDto>> createEventWithPerk(
            @Valid @RequestBody EventWithPerkCreateRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        EventResponseDto responseDto = eventService.createEventWithPerk(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }
}

