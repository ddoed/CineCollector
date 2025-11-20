package com.example.cinecollector.event.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.event.dto.*;
import com.example.cinecollector.event.entity.Event;
import com.example.cinecollector.event.repository.EventRepository;
import com.example.cinecollector.inventory.entity.Inventory;
import com.example.cinecollector.inventory.entity.PerkStatus;
import com.example.cinecollector.inventory.repository.InventoryRepository;
import com.example.cinecollector.movie.entity.Movie;
import com.example.cinecollector.movie.repository.MovieRepository;
import com.example.cinecollector.perk.entity.Perk;
import com.example.cinecollector.perk.repository.PerkRepository;
import com.example.cinecollector.theater.entity.Theater;
import com.example.cinecollector.theater.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final MovieRepository movieRepository;
    private final PerkRepository perkRepository;
    private final InventoryRepository inventoryRepository;
    private final TheaterRepository theaterRepository;

    @Transactional
    public EventResponseDto createEvent(Long userId, EventCreateRequestDto dto) {
        if (!movieRepository.existsById(dto.getMovieId())) {
            throw new BusinessException(ErrorCode.MOVIE_NOT_FOUND);
        }
        Event event = Event.builder()
                .movieId(dto.getMovieId())
                .creatorId(userId)
                .title(dto.getTitle())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .weekNo(dto.getWeekNo())
                .build();

        Event saved = eventRepository.save(event);
        return EventResponseDto.from(saved);
    }

    @Transactional
    public EventResponseDto updateEvent(Long userId, Long eventId, EventUpdateRequestDto dto) {
        Event origin = eventRepository.findById(eventId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));
        if (!origin.getCreatorId().equals(userId)) {
            throw new BusinessException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        Event updated = Event.builder()
                .eventId(origin.getEventId())
                .movieId(origin.getMovieId())
                .creatorId(origin.getCreatorId())
                .title(dto.getTitle() != null ? dto.getTitle() : origin.getTitle())
                .startDate(dto.getStartDate() != null ? dto.getStartDate() : origin.getStartDate())
                .endDate(dto.getEndDate() != null ? dto.getEndDate() : origin.getEndDate())
                .weekNo(dto.getWeekNo() != null ? dto.getWeekNo() : origin.getWeekNo())
                .build();

        Event update = eventRepository.update(updated);
        return EventResponseDto.from(update);
    }

    public EventResponseDto getEvent(Long eventId) {
        Event e = eventRepository.findById(eventId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));
        return EventResponseDto.from(e);
    }

    public List<EventResponseDto> getAllEvent() {
        return eventRepository.findAll().stream()
                .map(EventResponseDto::from)
                .toList();
    }

    @Transactional
    public void deleteEvent(Long userId, Long eventId) {
        Event foundEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));
        if (!foundEvent.getCreatorId().equals(userId)) {
            throw new BusinessException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        eventRepository.delete(eventId);
    }

    @Transactional(readOnly = true)
    public List<EventListDto> getEventList(String status, String movieTitle) {
        List<Event> events = eventRepository.findAllWithFilters(status, movieTitle);

        return events.stream()
                .map(this::convertToEventListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventDetailDto getEventDetail(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        Movie movie = movieRepository.findById(event.getMovieId())
                .orElseThrow(() -> new BusinessException(ErrorCode.MOVIE_NOT_FOUND));

        List<Perk> perks = perkRepository.findByEventId(eventId);

        List<EventDetailDto.PerkDetailDto> perkDetails = perks.stream()
                .map(perk -> {
                    List<Inventory> inventories = inventoryRepository.findAllByPerkId(perk.getPerkId());
                    List<EventDetailDto.TheaterInventoryDto> theaters = inventories.stream()
                            .map(inv -> {
                                Theater theater = theaterRepository.findById(inv.getTheaterId())
                                        .orElse(null);
                                if (theater == null) {
                                    return null;
                                }

                                String statusMessage = getStatusMessage(inv.getStock(), inv.getStatus());
                                String status = getStatusString(inv.getStatus(), inv.getStock());

                                return EventDetailDto.TheaterInventoryDto.builder()
                                        .theaterId(theater.getTheaterId())
                                        .name(theater.getName())
                                        .location(theater.getLocation())
                                        .stock(inv.getStock())
                                        .status(status)
                                        .statusMessage(statusMessage)
                                        .build();
                            })
                            .filter(java.util.Objects::nonNull)
                            .collect(Collectors.toList());

                    return EventDetailDto.PerkDetailDto.builder()
                            .perkId(perk.getPerkId())
                            .name(perk.getName())
                            .type(perk.getType())
                            .description(perk.getDescription())
                            .limitPerUser(perk.getLimitPerUser())
                            .theaters(theaters)
                            .build();
                })
                .collect(Collectors.toList());

        String eventStatus = calculateEventStatus(event.getStartDate(), event.getEndDate());

        return EventDetailDto.builder()
                .eventId(event.getEventId())
                .movie(EventDetailDto.MovieInfoDto.builder()
                        .movieId(movie.getMovieId())
                        .title(movie.getTitle())
                        .image(movie.getImage()) // 영화 이미지 사용
                        .build())
                .title(event.getTitle())
                .status(eventStatus)
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .weekNo(event.getWeekNo())
                .image(event.getImage()) // 이벤트 이미지
                .perks(perkDetails)
                .build();
    }

    private EventListDto convertToEventListDto(Event event) {
        Movie movie = movieRepository.findById(event.getMovieId())
                .orElse(null);
        if (movie == null) {
            return null;
        }

        List<Perk> perks = perkRepository.findByEventId(event.getEventId());
        List<EventListDto.PerkSummaryDto> perkSummaries = perks.stream()
                .map(perk -> EventListDto.PerkSummaryDto.builder()
                        .perkId(perk.getPerkId())
                        .name(perk.getName())
                        .type(perk.getType())
                        .build())
                .collect(Collectors.toList());

        // 각 특전별로 극장 수 계산
        Set<Long> uniqueTheaterIds = perks.stream()
                .flatMap(perk -> inventoryRepository.findAllByPerkId(perk.getPerkId()).stream()
                        .map(Inventory::getTheaterId))
                .collect(Collectors.toSet());

        String eventStatus = calculateEventStatus(event.getStartDate(), event.getEndDate());

        return EventListDto.builder()
                .eventId(event.getEventId())
                .movie(EventListDto.MovieInfoDto.builder()
                        .movieId(movie.getMovieId())
                        .title(movie.getTitle())
                        .image(movie.getImage())
                        .build())
                .title(event.getTitle())
                .status(eventStatus)
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .perks(perkSummaries)
                .theaterCount(uniqueTheaterIds.size())
                .build();
    }

    private String calculateEventStatus(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();
        
        // startDate가 null이면 알 수 없음
        if (startDate == null) {
            return "알 수 없음";
        }
        
        // endDate가 null인 경우, startDate만으로 판단
        if (endDate == null) {
            if (today.isBefore(startDate)) {
                return "예정";
            } else {
                // startDate가 지났으면 진행 중으로 간주 (종료일이 없으므로)
                return "진행 중";
            }
        }
        
        // startDate와 endDate가 모두 있는 경우
        if (today.isBefore(startDate)) {
            return "예정";
        } else if (today.isAfter(endDate)) {
            return "종료";
        } else {
            return "진행 중";
        }
    }

    private String getStatusString(PerkStatus status, Integer stock) {
        if (stock == null || stock <= 0) {
            return "소진 완료";
        }
        return switch (status) {
            case AVAILABLE -> "재고 있음";
            case LOW -> "재고 부족";
            case SOLD_OUT -> "소진 완료";
        };
    }

    private String getStatusMessage(Integer stock, PerkStatus status) {
        if (stock == null || stock <= 0) {
            return "소진 완료";
        }
        return stock + "개 남음";
    }

    @Transactional(readOnly = true)
    public EventManagementStatisticsDto getEventManagementStatistics(Long creatorId) {
        Map<String, Object> stats = eventRepository.getEventManagementStatistics(creatorId);

        Integer totalEvents = ((Number) stats.get("total_events")).intValue();
        Integer ongoingEvents = ((Number) stats.get("ongoing_events")).intValue();
        Integer totalPerkQuantity = ((Number) stats.get("total_perk_quantity")).intValue();

        return EventManagementStatisticsDto.builder()
                .totalEvents(totalEvents)
                .ongoingEvents(ongoingEvents)
                .totalPerkQuantity(totalPerkQuantity)
                .build();
    }

    @Transactional(readOnly = true)
    public List<EventListDto> getEventManagementList(Long creatorId, String status, String movieTitle, String eventTitle) {
        List<Event> events = eventRepository.findAllByCreatorIdWithFilters(creatorId, status, movieTitle, eventTitle);

        return events.stream()
                .map(this::convertToEventListDto)
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventResponseDto createEventWithPerk(Long userId, EventWithPerkCreateRequestDto dto) {
        if (!movieRepository.existsById(dto.getMovieId())) {
            throw new BusinessException(ErrorCode.MOVIE_NOT_FOUND);
        }

        // 이벤트 생성
        Event event = Event.builder()
                .movieId(dto.getMovieId())
                .creatorId(userId)
                .title(dto.getTitle())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .weekNo(dto.getWeekNo())
                .image(dto.getEventImage())
                .build();

        Event savedEvent = eventRepository.save(event);

        // 특전 생성
        if (dto.getPerk() != null) {
            Perk perk = Perk.builder()
                    .eventId(savedEvent.getEventId())
                    .name(dto.getPerk().getName())
                    .type(dto.getPerk().getType())
                    .limitPerUser(dto.getPerk().getLimitPerUser())
                    .quantity(dto.getPerk().getTotalQuantity())
                    .description(dto.getPerk().getDescription())
                    .image(dto.getPerk().getPerkImage())
                    .build();

            Perk savedPerk = perkRepository.save(perk);

            // 참여 극장 선택 (재고는 0으로 초기 설정)
            if (dto.getTheaterIds() != null && !dto.getTheaterIds().isEmpty()) {
                for (Long theaterId : dto.getTheaterIds()) {
                    // 극장 존재 확인
                    theaterRepository.findById(theaterId)
                            .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

                    // 이미 등록된 지점인지 확인
                    if (inventoryRepository.findById(theaterId, savedPerk.getPerkId()).isEmpty()) {
                        Inventory inv = Inventory.builder()
                                .theaterId(theaterId)
                                .perkId(savedPerk.getPerkId())
                                .stock(0)
                                .status(PerkStatus.SOLD_OUT)
                                .build();
                        inventoryRepository.save(inv);
                    }
                }
            }
        }

        return EventResponseDto.from(savedEvent);
    }
}

