package com.example.cinecollector.perk.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import com.example.cinecollector.perk.dto.PerkCreateRequestDto;
import com.example.cinecollector.perk.dto.PerkResponseDto;
import com.example.cinecollector.perk.dto.PerkUpdateRequestDto;
import com.example.cinecollector.perk.service.PerkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/perks")
public class PerkController {

    private final PerkService perkService;

    @PostMapping
    public ResponseEntity<ApiResponse
            <PerkResponseDto>> createPerk(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody PerkCreateRequestDto dto
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                perkService.createPerk(user.getUser().getUserId(), dto)
        ));
    }

    @PatchMapping("/{perkId}")
    public ResponseEntity<ApiResponse<PerkResponseDto>> updatePerk(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long perkId,
            @Valid @RequestBody PerkUpdateRequestDto dto
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                perkService.updatePerk(user.getUser().getUserId(), perkId, dto)
        ));
    }

    @DeleteMapping("/{perkId}")
    public ResponseEntity<ApiResponse<Void>> deletePerk(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long perkId
    ) {
        perkService.deletePerk(user.getUser().getUserId(), perkId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<ApiResponse<List<PerkResponseDto>>> findPerkByEvent(
            @PathVariable Long eventId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                perkService.getPerksByEvent(eventId)
        ));
    }
}

