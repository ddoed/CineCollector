package com.example.cinecollector.inventory.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.event.entity.Event;
import com.example.cinecollector.event.repository.EventRepository;
import com.example.cinecollector.inventory.dto.InventoryCreateRequestDto;
import com.example.cinecollector.inventory.dto.InventoryResponseDto;
import com.example.cinecollector.inventory.dto.InventoryUpdateRequestDto;
import com.example.cinecollector.inventory.entity.Inventory;
import com.example.cinecollector.inventory.entity.PerkStatus;
import com.example.cinecollector.inventory.repository.InventoryRepository;
import com.example.cinecollector.perk.entity.Perk;
import com.example.cinecollector.perk.repository.PerkRepository;
import com.example.cinecollector.theater.entity.Theater;
import com.example.cinecollector.theater.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final TheaterRepository theaterRepository;
    private final PerkRepository perkRepository;
    private final EventRepository eventRepository;

    @Transactional
    public InventoryResponseDto createInventory(Long creatorId, InventoryCreateRequestDto dto) {

        Theater theater = theaterRepository.findById(dto.getTheaterId())
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

        Perk perk = perkRepository.findById(dto.getPerkId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PERK_NOT_FOUND));

        Event event = eventRepository.findById(perk.getEventId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.getCreatorId().equals(creatorId)) {
            throw new BusinessException(ErrorCode.PERK_ACCESS_DENIED);
        }

        Inventory inv = Inventory.builder()
                .theaterId(theater.getTheaterId())
                .perkId(dto.getPerkId())
                .stock(dto.getStock())
                .status(dto.getStatus())
                .build();

        Inventory save = inventoryRepository.save(inv);
        return InventoryResponseDto.from(save);
    }

    @Transactional
    public InventoryResponseDto update(Long managerId, Long perkId, InventoryUpdateRequestDto dto) {

        Theater theater = theaterRepository.findByManagerId(managerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

        Perk perk = perkRepository.findById(perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PERK_NOT_FOUND));

        Inventory origin = inventoryRepository.findById(theater.getTheaterId(), perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVENTORY_NOT_FOUND));

        Inventory updated = Inventory.builder()
                .theaterId(origin.getTheaterId())
                .perkId(origin.getPerkId())
                .stock(dto.getStock() != null ? dto.getStock() : origin.getStock())
                .status(dto.getStatus() != null ? dto.getStatus() : origin.getStatus())
                .build();

        Inventory update = inventoryRepository.update(updated);
        return InventoryResponseDto.from(update);
    }

    @Transactional
    public void deleteInventory(Long managerId, Long perkId) {

        Theater theater = theaterRepository.findByManagerId(managerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

        Inventory origin = inventoryRepository.findById(theater.getTheaterId(), perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVENTORY_NOT_FOUND));

        inventoryRepository.delete(theater.getTheaterId(), perkId);
    }
}

