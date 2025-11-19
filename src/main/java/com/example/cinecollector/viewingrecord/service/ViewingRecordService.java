package com.example.cinecollector.viewingrecord.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.viewingrecord.dto.*;
import com.example.cinecollector.viewingrecord.entity.ViewingRecord;
import com.example.cinecollector.viewingrecord.repository.ViewingRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ViewingRecordService {

    private final ViewingRecordRepository viewingRecordRepository;

    @Transactional
    public ViewingRecordResponseDto createRecord(Long userId, ViewingRecordCreateRequestDto dto) {

        ViewingRecord v = ViewingRecord.builder()
                .userId(userId)
                .movieId(dto.getMovieId())
                .theaterId(dto.getTheaterId())
                .viewDate(dto.getViewDate())
                .review(dto.getReview())
                .isPublic(dto.getIsPublic() != null ? dto.getIsPublic() : false)
                .build();

        ViewingRecord saved = viewingRecordRepository.save(v);
        return ViewingRecordResponseDto.from(saved);
    }

    @Transactional
    public ViewingRecordResponseDto updateRecord(Long userId, Long recordId, ViewingRecordUpdateRequestDto dto) {

        ViewingRecord origin = viewingRecordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECORD_NOT_FOUND));

        if (!Objects.equals(origin.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.RECORD_ACCESS_DENIED);
        }

        ViewingRecord updateRecord = ViewingRecord.builder()
                .recordId(origin.getRecordId())
                .userId(origin.getUserId())
                .movieId(origin.getMovieId())
                .theaterId(origin.getTheaterId())
                .viewDate(dto.getViewDate() != null ? dto.getViewDate() : origin.getViewDate())
                .review(dto.getReview() != null ? dto.getReview() : origin.getReview())
                .isPublic(dto.getIsPublic() != null ? dto.getIsPublic() : origin.getIsPublic())
                .build();

        ViewingRecord updated = viewingRecordRepository.update(updateRecord);

        return ViewingRecordResponseDto.from(updated);
    }

    @Transactional
    public void deleteRecord(Long userId, Long recordId) {
        ViewingRecord record = viewingRecordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECORD_NOT_FOUND));

        if (!Objects.equals(record.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.RECORD_ACCESS_DENIED);
        }

        viewingRecordRepository.delete(recordId);
    }

    @Transactional(readOnly = true)
    public List<ViewingRecordResponseDto> getMyRecords(Long userId) {

        return viewingRecordRepository.findAllByUserId(userId).stream()
                .map(ViewingRecordResponseDto::from)
                .toList();
    }
}

