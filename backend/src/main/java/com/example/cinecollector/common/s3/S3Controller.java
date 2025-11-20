package com.example.cinecollector.common.s3;

import com.example.cinecollector.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    @PostMapping("/presigned-url")
    public ResponseEntity<ApiResponse<Map<String, String>>> generatePresigned(
            @RequestBody PresignedUrlRequestDto dto
    ) {
        Map<String, String> result = s3Service.generatePresignedUrl(
                dto.getDirectory(),
                dto.getFileName(),
                dto.getContentType()
        );
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}

