package com.example.cinecollector.perkapplication.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import com.example.cinecollector.perkapplication.dto.PerkApplicationRequestDto;
import com.example.cinecollector.perkapplication.dto.PerkApplicationResponseDto;
import com.example.cinecollector.perkapplication.service.PerkApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/perk-applications")
@RequiredArgsConstructor
public class PerkApplicationController {

    private final PerkApplicationService perkApplicationService;

    @PostMapping
    public ResponseEntity<ApiResponse<PerkApplicationResponseDto>> applyPerk(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PerkApplicationRequestDto dto
    ) {
        Long userId = userDetails.getUser().getUserId();
        PerkApplicationResponseDto response = perkApplicationService.applyPerk(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

