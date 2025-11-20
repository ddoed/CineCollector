package com.example.cinecollector.viewingrecord.dto;

import com.example.cinecollector.viewingrecord.entity.ViewingRecordImage;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ViewingRecordImageResponseDto {

    @JsonProperty("image_id")
    private Long imageId;

    @JsonProperty("record_id")
    private Long recordId;

    @JsonProperty("image_url")
    private String imageUrl;

    public static ViewingRecordImageResponseDto from(ViewingRecordImage image) {
        return ViewingRecordImageResponseDto.builder()
                .imageId(image.getImageId())
                .recordId(image.getRecordId())
                .imageUrl(image.getImageUrl())
                .build();
    }
}

