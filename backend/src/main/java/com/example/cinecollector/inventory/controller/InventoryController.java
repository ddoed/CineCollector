package com.example.cinecollector.inventory.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import com.example.cinecollector.inventory.dto.*;
import com.example.cinecollector.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryResponseDto>> createInventory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody InventoryCreateRequestDto dto
    ) {
        Long userId = userDetails.getUser().getUserId();
        InventoryResponseDto responseDto = inventoryService.createInventory(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    @PatchMapping("/{perkId}")
    public ResponseEntity<ApiResponse<InventoryResponseDto>> updateInventory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long perkId,
            @Valid @RequestBody InventoryUpdateRequestDto dto
    ) {
        InventoryResponseDto responseDto = inventoryService.update(userDetails.getUser().getUserId(), perkId, dto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    @DeleteMapping("/{perkId}")
    public ResponseEntity<ApiResponse<Void>> deleteInventory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long perkId
    ) {
        Long userId = userDetails.getUser().getUserId();
        inventoryService.deleteInventory(userId, perkId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/theaters")
    public ResponseEntity<ApiResponse<Void>> selectTheaters(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody TheaterSelectionDto dto
    ) {
        Long userId = userDetails.getUser().getUserId();
        inventoryService.selectTheaters(userId, dto.getPerkId(), dto.getTheaterIds());
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PatchMapping("/{perkId}/theaters/{theaterId}")
    public ResponseEntity<ApiResponse<InventoryResponseDto>> updateStock(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long perkId,
            @PathVariable Long theaterId,
            @RequestBody InventoryUpdateRequestDto dto
    ) {
        Long userId = userDetails.getUser().getUserId();
        InventoryResponseDto response = inventoryService.updateStock(
                userId, perkId, theaterId, dto.getStock(), dto.getStatus()
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<TheaterInventoryStatisticsDto>> getInventoryStatistics(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long managerId = userDetails.getUser().getUserId();
        TheaterInventoryStatisticsDto statistics = inventoryService.getInventoryStatistics(managerId);
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<TheaterInventoryListDto>>> getInventoryList(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String movieTitle,
            @RequestParam(required = false) String perkName
    ) {
        Long managerId = userDetails.getUser().getUserId();
        List<TheaterInventoryListDto> list = inventoryService.getInventoryList(managerId, movieTitle, perkName);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{perkId}/applicants")
    public ResponseEntity<ApiResponse<List<ApplicantListDto>>> getApplicantList(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long perkId
    ) {
        Long managerId = userDetails.getUser().getUserId();
        List<ApplicantListDto> applicants = inventoryService.getApplicantList(managerId, perkId);
        return ResponseEntity.ok(ApiResponse.success(applicants));
    }

    @GetMapping("/{perkId}/distribution")
    public ResponseEntity<ApiResponse<TheaterStockDistributionDto>> getTheaterStockDistribution(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long perkId
    ) {
        Long creatorId = userDetails.getUser().getUserId();
        TheaterStockDistributionDto distribution = inventoryService.getTheaterStockDistribution(creatorId, perkId);
        return ResponseEntity.ok(ApiResponse.success(distribution));
    }

    @PostMapping("/{perkId}/distribution")
    public ResponseEntity<ApiResponse<Void>> distributeStock(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long perkId,
            @Valid @RequestBody StockDistributionRequestDto dto
    ) {
        Long creatorId = userDetails.getUser().getUserId();
        inventoryService.distributeStock(creatorId, perkId, dto);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}

