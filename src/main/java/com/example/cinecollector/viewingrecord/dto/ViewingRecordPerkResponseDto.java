package com.example.cinecollector.viewingrecord.dto;

import com.example.cinecollector.viewingrecord.entity.ViewingRecordPerk;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ViewingRecordPerkResponseDto {

    @JsonProperty("record_id")
    private Long recordId;

    @JsonProperty("perk_id")
    private Long perkId;

    public static ViewingRecordPerkResponseDto from(ViewingRecordPerk viewingRecordPerk) {
        return ViewingRecordPerkResponseDto.builder()
                .recordId(viewingRecordPerk.getRecordId())
                .perkId(viewingRecordPerk.getPerkId())
                .build();
    }
}

