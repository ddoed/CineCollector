package com.example.cinecollector.common.s3;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class PresignedUrlRequestDto {

    @NotBlank
    private String directory;

    @NotBlank
    @JsonProperty("file_name")
    private String fileName;

    @NotBlank
    @JsonProperty("content_type")
    private String contentType;
}
