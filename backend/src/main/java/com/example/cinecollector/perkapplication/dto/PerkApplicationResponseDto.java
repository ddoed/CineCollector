package com.example.cinecollector.perkapplication.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PerkApplicationResponseDto {

    @JsonProperty("application_id")
    private Long applicationId;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("perk_id")
    private Long perkId;

    @JsonProperty("theater_id")
    private Long theaterId;

    @JsonProperty("quantity")
    private Integer quantity;

    @JsonProperty("is_obtained")
    private Boolean isObtained;  // true: 수령 완료, false: 미수령
}

