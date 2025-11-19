package com.example.cinecollector.viewingrecord.entity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ViewingRecordPerk {

    private Long recordId;
    private Long perkId;
}

