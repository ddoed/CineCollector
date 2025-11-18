package com.example.cinecollector.collection.dto;

import lombok.Builder;
import lombok.Getter;
import com.example.cinecollector.collection.entity.Collection;

import java.time.LocalDate;

@Getter
@Builder
public class CollectionResponseDto {
    private Long userId;
    private Long perkId;
    private Integer quantity;
    private LocalDate obtainedDate;

    public static CollectionResponseDto from(Collection c) {
        return CollectionResponseDto.builder()
                .userId(c.getUserId())
                .perkId(c.getPerkId())
                .quantity(c.getQuantity())
                .obtainedDate(c.getObtainedDate())
                .build();
    }
}

