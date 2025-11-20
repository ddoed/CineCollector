package com.example.cinecollector.viewingrecord.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.viewingrecord.dto.ViewingRecordPerkCreateRequestDto;
import com.example.cinecollector.viewingrecord.dto.ViewingRecordPerkResponseDto;
import com.example.cinecollector.viewingrecord.entity.ViewingRecord;
import com.example.cinecollector.viewingrecord.entity.ViewingRecordPerk;
import com.example.cinecollector.viewingrecord.repository.ViewingRecordPerkRepository;
import com.example.cinecollector.viewingrecord.repository.ViewingRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ViewingRecordPerkService {

    private final ViewingRecordPerkRepository viewingRecordPerkRepository;
    private final ViewingRecordRepository viewingRecordRepository;

    @Transactional
    public ViewingRecordPerkResponseDto createViewingRecordPerk(Long userId, ViewingRecordPerkCreateRequestDto dto) {
        ViewingRecord record = viewingRecordRepository.findById(dto.getRecordId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RECORD_NOT_FOUND));

        if (!Objects.equals(record.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.RECORD_ACCESS_DENIED);
        }

        ViewingRecordPerk viewingRecordPerk = ViewingRecordPerk.builder()
                .recordId(dto.getRecordId())
                .perkId(dto.getPerkId())
                .build();

        ViewingRecordPerk saved = viewingRecordPerkRepository.save(viewingRecordPerk);
        return ViewingRecordPerkResponseDto.from(saved);
    }

    @Transactional(readOnly = true)
    public List<ViewingRecordPerkResponseDto> getPerksByRecordId(Long userId, Long recordId) {
        ViewingRecord record = viewingRecordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECORD_NOT_FOUND));

        if (!Objects.equals(record.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.RECORD_ACCESS_DENIED);
        }

        return viewingRecordPerkRepository.findAllByRecordId(recordId).stream()
                .map(ViewingRecordPerkResponseDto::from)
                .toList();
    }

    @Transactional
    public void deleteViewingRecordPerk(Long userId, Long recordId, Long perkId) {
        ViewingRecord record = viewingRecordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECORD_NOT_FOUND));

        if (!Objects.equals(record.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.RECORD_ACCESS_DENIED);
        }

        viewingRecordPerkRepository.delete(recordId, perkId);
    }
}

