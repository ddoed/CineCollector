package com.example.cinecollector.event.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import com.example.cinecollector.event.dto.EventCreateRequestDto;
import com.example.cinecollector.event.dto.EventResponseDto;
import com.example.cinecollector.event.dto.EventUpdateRequestDto;
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

    @GetMapping("/{eventId}")
    public ResponseEntity<ApiResponse<EventResponseDto>> getEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getEvent(eventId)));
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
}

