package com.example.cinecollector.viewingrecord.dto;

import com.example.cinecollector.viewingrecord.entity.ViewingRecord;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ViewingRecordResponseDto {

    private Long recordId;
    private Long userId;
    private Long movieId;
    private Long theaterId;
    private LocalDate viewDate;
    private String review;
    private Boolean isPublic;

    public static ViewingRecordResponseDto from(ViewingRecord v) {
        return ViewingRecordResponseDto.builder()
                .recordId(v.getRecordId())
                .userId(v.getUserId())
                .movieId(v.getMovieId())
                .theaterId(v.getTheaterId())
                .viewDate(v.getViewDate())
                .review(v.getReview())
                .isPublic(v.getIsPublic())
                .build();
    }
}

