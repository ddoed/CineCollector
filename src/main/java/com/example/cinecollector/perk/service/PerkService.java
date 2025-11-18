package com.example.cinecollector.perk.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.event.entity.Event;
import com.example.cinecollector.event.repository.EventRepository;
import com.example.cinecollector.perk.dto.PerkCreateRequestDto;
import com.example.cinecollector.perk.dto.PerkResponseDto;
import com.example.cinecollector.perk.dto.PerkUpdateRequestDto;
import com.example.cinecollector.perk.entity.Perk;
import com.example.cinecollector.perk.repository.PerkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerkService {

    private final PerkRepository perkRepository;
    private final EventRepository eventRepository;

    @Transactional
    public PerkResponseDto createPerk(Long userId, PerkCreateRequestDto dto) {

        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.getCreatorId().equals(userId)) {
            throw new BusinessException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        Perk perk = Perk.builder()
                .eventId(dto.getEventId())
                .name(dto.getName())
                .type(dto.getType())
                .limitPerUser(dto.getLimitPerUser())
                .quantity(dto.getQuantity())
                .description(dto.getDescription())
                .build();

        return PerkResponseDto.from(perkRepository.save(perk));
    }

    @Transactional
    public PerkResponseDto updatePerk(Long userId, Long perkId, PerkUpdateRequestDto dto) {

        Perk origin = perkRepository.findById(perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PERK_NOT_FOUND));

        Event event = eventRepository.findById(origin.getEventId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.getCreatorId().equals(userId)) {
            throw new BusinessException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        Perk updated = Perk.builder()
                .perkId(origin.getPerkId())
                .eventId(origin.getEventId())
                .name(dto.getName() != null ? dto.getName() : origin.getName())
                .type(dto.getType() != null ? dto.getType() : origin.getType())
                .limitPerUser(dto.getLimitPerUser() != null ? dto.getLimitPerUser() : origin.getLimitPerUser())
                .quantity(dto.getQuantity() != null ? dto.getQuantity() : origin.getQuantity())
                .description(dto.getDescription() != null ? dto.getDescription() : origin.getDescription())
                .build();

        perkRepository.update(updated);
        return PerkResponseDto.from(updated);
    }

    @Transactional
    public void deletePerk(Long userId, Long perkId) {

        Perk perk = perkRepository.findById(perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PERK_NOT_FOUND));

        Event event = eventRepository.findById(perk.getEventId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.getCreatorId().equals(userId)) {
            throw new BusinessException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        perkRepository.delete(perkId);
    }

    @Transactional
    public List<PerkResponseDto> getPerksByEvent(Long eventId) {
        return perkRepository.findByEventId(eventId).stream()
                .map(PerkResponseDto::from)
                .toList();
    }
}

