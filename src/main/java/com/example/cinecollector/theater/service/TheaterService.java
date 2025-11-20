package com.example.cinecollector.theater.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.theater.dto.TheaterCreateRequestDto;
import com.example.cinecollector.theater.dto.TheaterResponseDto;
import com.example.cinecollector.theater.dto.TheaterUpdateRequestDto;
import com.example.cinecollector.theater.entity.Theater;
import com.example.cinecollector.theater.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TheaterService {

    private final TheaterRepository theaterRepository;

    @Transactional
    public TheaterResponseDto createTheater(Long managerId, TheaterCreateRequestDto dto) {

        if (theaterRepository.findByManagerId(managerId).isPresent()) {
            throw new BusinessException(ErrorCode.THEATER_ALREADY_EXISTS);
        }

        Theater t = Theater.builder()
                .name(dto.getName())
                .location(dto.getLocation())
                .managerId(managerId)
                .build();

        Theater save = theaterRepository.save(t);
        return TheaterResponseDto.from(save);
    }

    public TheaterResponseDto getTheater(Long theaterId) {
        Theater t = theaterRepository.findById(theaterId)
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));
        return TheaterResponseDto.from(t);
    }

    public List<TheaterResponseDto> getAllTheater() {
        return theaterRepository.findAll().stream()
                .map(TheaterResponseDto::from)
                .toList();
    }

    @Transactional
    public TheaterResponseDto updateTheater(Long managerId, Long theaterId, TheaterUpdateRequestDto dto) {

        Theater origin = theaterRepository.findById(theaterId)
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

        if (!origin.getManagerId().equals(managerId)) {
            throw new BusinessException(ErrorCode.THEATER_ACCESS_DENIED);
        }

        Theater updated = Theater.builder()
                .theaterId(origin.getTheaterId())
                .managerId(origin.getManagerId())
                .name(dto.getName() != null ? dto.getName() : origin.getName())
                .location(dto.getLocation() != null ? dto.getLocation() : origin.getLocation())
                .build();

        Theater update = theaterRepository.update(updated);
        return TheaterResponseDto.from(update);
    }

    @Transactional
    public void deleteTheater(Long userId, Long theaterId) {
        Theater t = theaterRepository.findById(theaterId)
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

        if (!t.getManagerId().equals(userId)) {
            throw new BusinessException(ErrorCode.THEATER_ACCESS_DENIED);
        }

        theaterRepository.delete(theaterId);
    }

    public TheaterResponseDto getTheaterByManagerId(Long managerId) {
        Theater theater = theaterRepository.findByManagerId(managerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));
        return TheaterResponseDto.from(theater);
    }
}
