package com.example.cinecollector.viewingrecord.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ViewingRecordImageCreateRequestDto {

    @NotNull
    @JsonProperty("record_id")
    private Long recordId;

    @NotBlank
    @JsonProperty("image_url")
    private String imageUrl;
}

