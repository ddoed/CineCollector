package com.example.cinecollector.viewingrecord.controller;

import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import com.example.cinecollector.viewingrecord.dto.ViewingRecordImageCreateRequestDto;
import com.example.cinecollector.viewingrecord.dto.ViewingRecordImageResponseDto;
import com.example.cinecollector.viewingrecord.service.ViewingRecordImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/viewing-record-images")
@RequiredArgsConstructor
public class ViewingRecordImageController {

    private final ViewingRecordImageService viewingRecordImageService;

    @PostMapping
    public ResponseEntity<ApiResponse<ViewingRecordImageResponseDto>> createImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ViewingRecordImageCreateRequestDto dto
    ) {
        Long userId = userDetails.getUser().getUserId();
        ViewingRecordImageResponseDto response = viewingRecordImageService.createImage(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/records/{recordId}")
    public ResponseEntity<ApiResponse<List<ViewingRecordImageResponseDto>>> getImagesByRecordId(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recordId
    ) {
        Long userId = userDetails.getUser().getUserId();
        List<ViewingRecordImageResponseDto> list = viewingRecordImageService.getImagesByRecordId(userId, recordId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long imageId
    ) {
        Long userId = userDetails.getUser().getUserId();
        viewingRecordImageService.deleteImage(userId, imageId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}

