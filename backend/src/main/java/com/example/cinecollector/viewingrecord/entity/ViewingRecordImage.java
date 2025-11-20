package com.example.cinecollector.viewingrecord.entity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ViewingRecordImage {

    private Long imageId;
    private Long recordId;
    private String imageUrl;
}

