package com.example.cinecollector.event.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.event.dto.EventCreateRequestDto;
import com.example.cinecollector.event.dto.EventResponseDto;
import com.example.cinecollector.event.dto.EventUpdateRequestDto;
import com.example.cinecollector.event.entity.Event;
import com.example.cinecollector.event.repository.EventRepository;
import com.example.cinecollector.movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final MovieRepository movieRepository;

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
}

