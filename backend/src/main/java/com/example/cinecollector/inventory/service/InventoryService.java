package com.example.cinecollector.inventory.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.event.entity.Event;
import com.example.cinecollector.event.repository.EventRepository;
import com.example.cinecollector.inventory.dto.*;
import com.example.cinecollector.inventory.entity.Inventory;
import com.example.cinecollector.inventory.entity.PerkStatus;
import com.example.cinecollector.inventory.repository.InventoryRepository;
import com.example.cinecollector.movie.entity.Movie;
import com.example.cinecollector.movie.repository.MovieRepository;
import com.example.cinecollector.perk.entity.Perk;
import com.example.cinecollector.perk.repository.PerkRepository;
import com.example.cinecollector.theater.entity.Theater;
import com.example.cinecollector.theater.repository.TheaterRepository;
import com.example.cinecollector.collection.repository.CollectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final TheaterRepository theaterRepository;
    private final PerkRepository perkRepository;
    private final EventRepository eventRepository;
    private final CollectionRepository collectionRepository;
    private final MovieRepository movieRepository;


    @Transactional
    public void selectTheaters(Long creatorId, Long perkId, List<Long> theaterIds) {
        Perk perk = perkRepository.findById(perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PERK_NOT_FOUND));

        Event event = eventRepository.findById(perk.getEventId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.getCreatorId().equals(creatorId)) {
            throw new BusinessException(ErrorCode.PERK_ACCESS_DENIED);
        }

        for (Long theaterId : theaterIds) {
            Theater theater = theaterRepository.findById(theaterId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

            // 이미 등록된 지점인지 확인
            if (inventoryRepository.findById(theaterId, perkId).isEmpty()) {
                // 지점 선택 (재고는 0, 상태는 SOLD_OUT으로 초기 설정)
                Inventory inv = Inventory.builder()
                        .theaterId(theaterId)
                        .perkId(perkId)
                        .stock(0)
                        .status(PerkStatus.SOLD_OUT)
                        .build();
                inventoryRepository.save(inv);
            }
        }
    }

    @Transactional
    public InventoryResponseDto updateStock(Long userId, Long perkId, Long theaterId, Integer stock, PerkStatus status) {
        Perk perk = perkRepository.findById(perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PERK_NOT_FOUND));

        Event event = eventRepository.findById(perk.getEventId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        // 이벤트 생성자이거나 해당 극장의 매니저인지 확인
        boolean isCreator = event.getCreatorId().equals(userId);
        boolean isTheaterManager = false;
        
        if (!isCreator) {
            // 극장 매니저인지 확인 - theaterId로 극장을 찾고 manager_id 확인
            Theater theater = theaterRepository.findById(theaterId)
                    .orElse(null);
            if (theater != null && theater.getManagerId().equals(userId)) {
                isTheaterManager = true;
            }
        }

        if (!isCreator && !isTheaterManager) {
            throw new BusinessException(ErrorCode.PERK_ACCESS_DENIED);
        }

        Inventory origin = inventoryRepository.findById(theaterId, perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVENTORY_NOT_FOUND));

        Inventory updated = Inventory.builder()
                .theaterId(origin.getTheaterId())
                .perkId(origin.getPerkId())
                .stock(stock != null ? stock : origin.getStock())
                .status(status != null ? status : origin.getStatus())
                .build();

        Inventory result = inventoryRepository.update(updated);
        return InventoryResponseDto.from(result);
    }

    @Transactional(readOnly = true)
    public TheaterInventoryStatisticsDto getInventoryStatistics(Long managerId) {
        Theater theater = theaterRepository.findByManagerId(managerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

        Map<String, Object> stats = inventoryRepository.getInventoryStatistics(theater.getTheaterId());

        Integer totalPerks = ((Number) stats.get("total_perks")).intValue();
        Integer lowStockCount = ((Number) stats.get("low_stock_count")).intValue();
        Integer soldOutCount = ((Number) stats.get("sold_out_count")).intValue();

        return TheaterInventoryStatisticsDto.builder()
                .totalPerks(totalPerks)
                .lowStockCount(lowStockCount)
                .soldOutCount(soldOutCount)
                .build();
    }

    @Transactional(readOnly = true)
    public List<TheaterInventoryListDto> getInventoryList(Long managerId, String movieTitle, String perkName) {
        Theater theater = theaterRepository.findByManagerId(managerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

        List<Map<String, Object>> inventoryList = inventoryRepository.findInventoryListByTheaterId(
                theater.getTheaterId(), movieTitle, perkName);

        return inventoryList.stream()
                .map(row -> {
                    Long perkId = ((Number) row.get("perk_id")).longValue();
                    String status = (String) row.get("status");
                    Integer remainingStock = ((Number) row.get("remaining_stock")).intValue();
                    Integer totalStock = row.get("total_stock") != null 
                            ? ((Number) row.get("total_stock")).intValue() : 0;
                    String stockStatus = convertStatusToKorean(status);

                    // 신청자 수 조회 (해당 perk_id를 가진 collections 수)
                    int applicantCount = collectionRepository.findAllByPerkId(perkId).size();

                    return TheaterInventoryListDto.builder()
                            .perkId(perkId)
                            .movie(TheaterInventoryListDto.MovieInfoDto.builder()
                                    .movieId(((Number) row.get("movie_id")).longValue())
                                    .title((String) row.get("movie_title"))
                                    .image((String) row.get("movie_image"))
                                    .build())
                            .perkName((String) row.get("perk_name"))
                            .weekNo((Integer) row.get("week_no"))
                            .eventTitle((String) row.get("event_title"))
                            .stockStatus(stockStatus)
                            .remainingStock(remainingStock)
                            .totalStock(totalStock)
                            .startDate(row.get("start_date") != null 
                                    ? ((java.sql.Date) row.get("start_date")).toLocalDate() : null)
                            .endDate(row.get("end_date") != null 
                                    ? ((java.sql.Date) row.get("end_date")).toLocalDate() : null)
                            .limitPerUser((Integer) row.get("limit_per_user"))
                            .applicantCount(applicantCount)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private String convertStatusToKorean(String status) {
        if (status == null) {
            return "알 수 없음";
        }
        return switch (status) {
            case "AVAILABLE" -> "재고 있음";
            case "LOW" -> "소량";
            case "SOLD_OUT" -> "소진";
            default -> "알 수 없음";
        };
    }

    @Transactional(readOnly = true)
    public List<com.example.cinecollector.inventory.dto.ApplicantListDto> getApplicantList(Long managerId, Long perkId) {
        Theater theater = theaterRepository.findByManagerId(managerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

        // 해당 특전이 이 극장에 있는지 확인
        Inventory inventory = inventoryRepository.findById(theater.getTheaterId(), perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVENTORY_NOT_FOUND));

        // 신청자 목록 조회
        List<Map<String, Object>> applicants = collectionRepository.findApplicantsByPerkId(perkId);

        return applicants.stream()
                .map(row -> {
                    Long userId = ((Number) row.get("user_id")).longValue();
                    String name = (String) row.get("name");
                    String email = (String) row.get("email");
                    Integer quantity = ((Number) row.get("quantity")).intValue();
                    
                    // obtained_date를 LocalDateTime으로 변환 (시간 정보가 없으면 00:00:00으로 설정)
                    java.sql.Date obtainedDate = (java.sql.Date) row.get("obtained_date");
                    java.time.LocalDateTime appliedAt = null;
                    if (obtainedDate != null) {
                        appliedAt = obtainedDate.toLocalDate().atStartOfDay();
                    }

                    return ApplicantListDto.builder()
                            .userId(userId)
                            .name(name)
                            .email(email)
                            .appliedAt(appliedAt)
                            .quantity(quantity)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TheaterStockDistributionDto getTheaterStockDistribution(Long creatorId, Long perkId) {
        Perk perk = perkRepository.findById(perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PERK_NOT_FOUND));

        Event event = eventRepository.findById(perk.getEventId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.getCreatorId().equals(creatorId)) {
            throw new BusinessException(ErrorCode.PERK_ACCESS_DENIED);
        }

        Movie movie = movieRepository.findById(event.getMovieId())
                .orElseThrow(() -> new BusinessException(ErrorCode.MOVIE_NOT_FOUND));

        // 해당 특전의 재고가 등록된 극장들만 조회 (이벤트 생성 시 선택한 극장들)
        List<Inventory> inventories = inventoryRepository.findAllByPerkId(perkId);

        List<TheaterStockDistributionDto.TheaterStockDto> theaterStocks = inventories.stream()
                .map(inventory -> {
                    Theater theater = theaterRepository.findById(inventory.getTheaterId())
                            .orElse(null);
                    if (theater == null) {
                        return null;
                    }

                    return TheaterStockDistributionDto.TheaterStockDto.builder()
                            .theaterId(theater.getTheaterId())
                            .name(theater.getName())
                            .location(theater.getLocation())
                            .currentStock(inventory.getStock())
                            .build();
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());

        return TheaterStockDistributionDto.builder()
                .perkId(perk.getPerkId())
                .perkName(perk.getName())
                .perkType(perk.getType())
                .movie(TheaterStockDistributionDto.MovieInfoDto.builder()
                        .movieId(movie.getMovieId())
                        .title(movie.getTitle())
                        .build())
                .totalQuantity(perk.getQuantity())
                .theaters(theaterStocks)
                .build();
    }

    @Transactional
    public void distributeStock(Long creatorId, Long perkId, StockDistributionRequestDto dto) {
        Perk perk = perkRepository.findById(perkId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PERK_NOT_FOUND));

        Event event = eventRepository.findById(perk.getEventId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.getCreatorId().equals(creatorId)) {
            throw new BusinessException(ErrorCode.PERK_ACCESS_DENIED);
        }

        // 총 배포 수량 확인
        int totalDistributed = dto.getTheaterStocks().stream()
                .mapToInt(StockDistributionRequestDto.TheaterStockItemDto::getStock)
                .sum();

        if (perk.getQuantity() != null && totalDistributed > perk.getQuantity()) {
            throw new BusinessException(ErrorCode.STOCK_INSUFFICIENT);
        }

        // 각 극장별 재고 업데이트 또는 생성
        for (StockDistributionRequestDto.TheaterStockItemDto item : dto.getTheaterStocks()) {
            Theater theater = theaterRepository.findById(item.getTheaterId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

            Optional<Inventory> existingInventory = inventoryRepository.findById(theater.getTheaterId(), perkId);

            if (existingInventory.isPresent()) {
                // 기존 재고 업데이트
                Inventory updated = Inventory.builder()
                        .theaterId(theater.getTheaterId())
                        .perkId(perkId)
                        .stock(item.getStock())
                        .status(calculateNewStatus(item.getStock()))
                        .build();
                inventoryRepository.update(updated);
            } else {
                // 새 재고 생성
                Inventory newInventory = Inventory.builder()
                        .theaterId(theater.getTheaterId())
                        .perkId(perkId)
                        .stock(item.getStock())
                        .status(calculateNewStatus(item.getStock()))
                        .build();
                inventoryRepository.save(newInventory);
            }
        }
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

