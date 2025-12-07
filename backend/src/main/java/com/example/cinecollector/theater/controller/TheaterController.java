package com.example.cinecollector.theater.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import com.example.cinecollector.theater.dto.TheaterResponseDto;
import com.example.cinecollector.theater.dto.TheaterUpdateRequestDto;
import com.example.cinecollector.theater.service.TheaterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/theaters")
public class TheaterController {

    private final TheaterService theaterService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TheaterResponseDto>>> getAllTheater() {
        List<TheaterResponseDto> all = theaterService.getAllTheater();
        return ResponseEntity.ok(ApiResponse.success(all));
    }

    @PatchMapping("/{theaterId}")
    public ResponseEntity<ApiResponse<TheaterResponseDto>> updateTheater(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long theaterId,
            @Valid @RequestBody TheaterUpdateRequestDto dto
    ) {
        Long userId = user.getUser().getUserId();
        TheaterResponseDto responseDto = theaterService.updateTheater(userId, theaterId, dto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<TheaterResponseDto>> getMyTheater(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        TheaterResponseDto responseDto = theaterService.getTheaterByManagerId(userId);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }
}
