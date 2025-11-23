package com.example.cinecollector.perkapplication.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.inventory.entity.Inventory;
import com.example.cinecollector.inventory.entity.PerkStatus;
import com.example.cinecollector.inventory.repository.InventoryRepository;
import com.example.cinecollector.perk.entity.Perk;
import com.example.cinecollector.perk.repository.PerkRepository;
import com.example.cinecollector.perkapplication.dto.PerkApplicationRequestDto;
import com.example.cinecollector.perkapplication.dto.PerkApplicationResponseDto;
import com.example.cinecollector.perkapplication.entity.PerkApplication;
import com.example.cinecollector.perkapplication.repository.PerkApplicationRepository;
import com.example.cinecollector.theater.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PerkApplicationService {

    private final PerkRepository perkRepository;
    private final TheaterRepository theaterRepository;
    private final InventoryRepository inventoryRepository;
    private final PerkApplicationRepository perkApplicationRepository;

    @Transactional
    public PerkApplicationResponseDto applyPerk(Long userId, PerkApplicationRequestDto dto) {
        // 특전 존재 확인
        Perk perk = perkRepository.findById(dto.getPerkId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PERK_NOT_FOUND));

        // 극장 존재 확인
        theaterRepository.findById(dto.getTheaterId())
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

        // 재고 확인
        Inventory inventory = inventoryRepository.findById(dto.getTheaterId(), dto.getPerkId())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVENTORY_NOT_FOUND));

        // 재고 부족 확인
        if (inventory.getStock() == null || inventory.getStock() < dto.getQuantity()) {
            throw new BusinessException(ErrorCode.STOCK_INSUFFICIENT);
        }

        // 재고 상태 확인
        if (inventory.getStatus() == PerkStatus.SOLD_OUT) {
            throw new BusinessException(ErrorCode.STOCK_INSUFFICIENT);
        }

        // 1인당 제한 수량 확인
        if (perk.getLimitPerUser() != null) {
            // 사용자가 이미 신청한 수량 확인 (perk_applications에서 확인)
            int currentQuantity = perkApplicationRepository.countByUserIdAndPerkId(userId, dto.getPerkId());
            int requestedQuantity = dto.getQuantity();
            int totalQuantity = currentQuantity + requestedQuantity;

            if (totalQuantity > perk.getLimitPerUser()) {
                throw new BusinessException(ErrorCode.LIMIT_EXCEEDED);
            }
        }

        // 재고 차감
        int newStock = inventory.getStock() - dto.getQuantity();
        PerkStatus newStatus = calculateNewStatus(newStock);

        Inventory updatedInventory = Inventory.builder()
                .theaterId(inventory.getTheaterId())
                .perkId(inventory.getPerkId())
                .stock(newStock)
                .status(newStatus)
                .build();
        inventoryRepository.update(updatedInventory);

        // PerkApplication에 신청 기록 저장 (is_obtained는 false - 아직 수령 안 함)
        PerkApplication newApplication = PerkApplication.builder()
                .userId(userId)
                .perkId(dto.getPerkId())
                .theaterId(dto.getTheaterId())
                .quantity(dto.getQuantity())
                .isObtained(false)  // 수령 시점에 true로 업데이트
                .build();

        PerkApplication savedApplication = perkApplicationRepository.save(newApplication);

        return PerkApplicationResponseDto.builder()
                .applicationId(savedApplication.getApplicationId())
                .userId(savedApplication.getUserId())
                .perkId(savedApplication.getPerkId())
                .theaterId(savedApplication.getTheaterId())
                .quantity(savedApplication.getQuantity())
                .isObtained(savedApplication.getIsObtained())
                .build();
    }

    private PerkStatus calculateNewStatus(int stock) {
        if (stock <= 0) {
            return PerkStatus.SOLD_OUT;
        } else if (stock <= 10) {
            return PerkStatus.LOW;
        } else {
            return PerkStatus.AVAILABLE;
        }
    }
}

