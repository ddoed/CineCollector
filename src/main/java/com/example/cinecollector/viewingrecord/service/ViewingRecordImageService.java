package com.example.cinecollector.viewingrecord.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.viewingrecord.dto.ViewingRecordImageCreateRequestDto;
import com.example.cinecollector.viewingrecord.dto.ViewingRecordImageResponseDto;
import com.example.cinecollector.viewingrecord.entity.ViewingRecord;
import com.example.cinecollector.viewingrecord.entity.ViewingRecordImage;
import com.example.cinecollector.viewingrecord.repository.ViewingRecordImageRepository;
import com.example.cinecollector.viewingrecord.repository.ViewingRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ViewingRecordImageService {

    private final ViewingRecordImageRepository viewingRecordImageRepository;
    private final ViewingRecordRepository viewingRecordRepository;

    @Transactional
    public ViewingRecordImageResponseDto createImage(Long userId, ViewingRecordImageCreateRequestDto dto) {
        ViewingRecord record = viewingRecordRepository.findById(dto.getRecordId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RECORD_NOT_FOUND));

        if (!Objects.equals(record.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.RECORD_ACCESS_DENIED);
        }

        ViewingRecordImage image = ViewingRecordImage.builder()
                .recordId(dto.getRecordId())
                .imageUrl(dto.getImageUrl())
                .build();

        ViewingRecordImage saved = viewingRecordImageRepository.save(image);
        return ViewingRecordImageResponseDto.from(saved);
    }

    @Transactional(readOnly = true)
    public List<ViewingRecordImageResponseDto> getImagesByRecordId(Long userId, Long recordId) {
        ViewingRecord record = viewingRecordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECORD_NOT_FOUND));

        if (!Objects.equals(record.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.RECORD_ACCESS_DENIED);
        }

        return viewingRecordImageRepository.findAllByRecordId(recordId).stream()
                .map(ViewingRecordImageResponseDto::from)
                .toList();
    }

    @Transactional
    public void deleteImage(Long userId, Long imageId) {
        ViewingRecordImage image = viewingRecordImageRepository.findById(imageId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECORD_NOT_FOUND));

        ViewingRecord record = viewingRecordRepository.findById(image.getRecordId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RECORD_NOT_FOUND));

        if (!Objects.equals(record.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.RECORD_ACCESS_DENIED);
        }

        viewingRecordImageRepository.delete(imageId);
    }
}

