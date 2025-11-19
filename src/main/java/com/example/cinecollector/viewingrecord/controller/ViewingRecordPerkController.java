package com.example.cinecollector.viewingrecord.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import com.example.cinecollector.viewingrecord.dto.ViewingRecordPerkCreateRequestDto;
import com.example.cinecollector.viewingrecord.dto.ViewingRecordPerkResponseDto;
import com.example.cinecollector.viewingrecord.service.ViewingRecordPerkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/viewing-record-perks")
@RequiredArgsConstructor
public class ViewingRecordPerkController {

    private final ViewingRecordPerkService viewingRecordPerkService;

    @PostMapping
    public ResponseEntity<ApiResponse<ViewingRecordPerkResponseDto>> createViewingRecordPerk(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ViewingRecordPerkCreateRequestDto dto
    ) {
        Long userId = userDetails.getUser().getUserId();
        ViewingRecordPerkResponseDto response = viewingRecordPerkService.createViewingRecordPerk(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/records/{recordId}")
    public ResponseEntity<ApiResponse<List<ViewingRecordPerkResponseDto>>> getPerksByRecordId(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recordId
    ) {
        Long userId = userDetails.getUser().getUserId();
        List<ViewingRecordPerkResponseDto> list = viewingRecordPerkService.getPerksByRecordId(userId, recordId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @DeleteMapping("/records/{recordId}/perks/{perkId}")
    public ResponseEntity<ApiResponse<Void>> deleteViewingRecordPerk(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recordId,
            @PathVariable Long perkId
    ) {
        Long userId = userDetails.getUser().getUserId();
        viewingRecordPerkService.deleteViewingRecordPerk(userId, recordId, perkId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}

