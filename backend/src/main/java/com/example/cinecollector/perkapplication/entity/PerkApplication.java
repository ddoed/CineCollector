package com.example.cinecollector.perkapplication.entity;

import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;

@Getter
@Builder
public class PerkApplication {

    private Long applicationId;
    private Long userId;
    private Long perkId;
    private Long theaterId;
    private Integer quantity;
    private Timestamp appliedAt;
    private Boolean isObtained;  // true: 수령 완료, false: 미수령
}

