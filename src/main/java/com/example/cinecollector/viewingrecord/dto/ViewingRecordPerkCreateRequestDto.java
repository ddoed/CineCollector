package com.example.cinecollector.viewingrecord.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ViewingRecordPerkCreateRequestDto {

    @NotNull
    @JsonProperty("record_id")
    private Long recordId;

    @NotNull
    @JsonProperty("perk_id")
    private Long perkId;
}

