package com.example.cinecollector.collection.controller;

import com.example.cinecollector.collection.dto.CollectionCreateRequestDto;
import com.example.cinecollector.collection.dto.CollectionResponseDto;
import com.example.cinecollector.collection.dto.CollectionUpdateRequestDto;
import com.example.cinecollector.collection.service.CollectionService;
import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @PostMapping
    public ResponseEntity<ApiResponse<CollectionResponseDto>> createCollection(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CollectionCreateRequestDto dto
    ) {
        Long userId = userDetails.getUser().getUserId();
        CollectionResponseDto responseDto = collectionService.createCollection(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    @PatchMapping("/{perkId}")
    public ResponseEntity<ApiResponse<CollectionResponseDto>> updateCollection(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long perkId,
            @RequestBody CollectionUpdateRequestDto dto
    ) {
        Long userId = userDetails.getUser().getUserId();
        CollectionResponseDto responseDto = collectionService.updateCollection(userId, perkId, dto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    @DeleteMapping("/{perkId}")
    public ResponseEntity<ApiResponse<Void>> deleteCollection(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long perkId
    ) {
        Long userId = userDetails.getUser().getUserId();
        collectionService.deleteCollection(userId, perkId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CollectionResponseDto>>> getMyCollections(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        List<CollectionResponseDto> myCollections = collectionService.getMyCollections(userId);
        return ResponseEntity.ok(ApiResponse.success(myCollections));
    }
}

