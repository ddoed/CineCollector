package com.example.cinecollector.collection.service;

import com.example.cinecollector.collection.dto.CollectionCreateRequestDto;
import com.example.cinecollector.collection.dto.CollectionResponseDto;
import com.example.cinecollector.collection.dto.CollectionUpdateRequestDto;
import com.example.cinecollector.collection.entity.Collection;
import com.example.cinecollector.collection.repository.CollectionRepository;
import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.perk.repository.PerkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final PerkRepository perkRepository;

    @Transactional
    public CollectionResponseDto createCollection(Long userId, CollectionCreateRequestDto dto) {

        perkRepository.findById(dto.getPerkId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PERK_NOT_FOUND));

        Collection c = Collection.builder()
                .userId(userId)
                .perkId(dto.getPerkId())
                .quantity(dto.getQuantity() != null ? dto.getQuantity() : 1)
                .obtainedDate(dto.getObtainedDate())
                .build();

        Collection save = collectionRepository.save(c);
        return CollectionResponseDto.from(save);
    }

    @Transactional
    public CollectionResponseDto updateCollection(Long userId, Long perkId, CollectionUpdateRequestDto dto) {

        Collection origin = collectionRepository.findById(userId, perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COLLECTION_NOT_FOUND));

        Collection updated = Collection.builder()
                .userId(origin.getUserId())
                .perkId(origin.getPerkId())
                .quantity(dto.getQuantity() != null ? dto.getQuantity() : origin.getQuantity())
                .obtainedDate(dto.getObtainedDate() != null ? dto.getObtainedDate() : origin.getObtainedDate())
                .build();

        Collection update = collectionRepository.update(updated);
        return CollectionResponseDto.from(update);
    }

    @Transactional
    public void deleteCollection(Long userId, Long perkId) {
        collectionRepository.findById(userId, perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COLLECTION_NOT_FOUND));

        collectionRepository.delete(userId, perkId);
    }

    @Transactional(readOnly = true)
    public List<CollectionResponseDto> getMyCollections(Long userId) {

        return collectionRepository.findAllByUserId(userId).stream()
                .map(CollectionResponseDto::from)
                .toList();
    }
}

