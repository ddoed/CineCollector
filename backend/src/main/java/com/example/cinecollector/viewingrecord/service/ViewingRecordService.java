package com.example.cinecollector.viewingrecord.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.movie.entity.Movie;
import com.example.cinecollector.movie.repository.MovieRepository;
import com.example.cinecollector.perk.entity.Perk;
import com.example.cinecollector.perk.repository.PerkRepository;
import com.example.cinecollector.theater.entity.Theater;
import com.example.cinecollector.theater.repository.TheaterRepository;
import com.example.cinecollector.user.entity.User;
import com.example.cinecollector.user.repository.UserRepository;
import com.example.cinecollector.viewingrecord.dto.*;
import com.example.cinecollector.viewingrecord.entity.ViewingRecord;
import com.example.cinecollector.viewingrecord.entity.ViewingRecordImage;
import com.example.cinecollector.viewingrecord.entity.ViewingRecordPerk;
import com.example.cinecollector.viewingrecord.repository.ViewingRecordImageRepository;
import com.example.cinecollector.viewingrecord.repository.ViewingRecordPerkRepository;
import com.example.cinecollector.viewingrecord.repository.ViewingRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ViewingRecordService {

    private final ViewingRecordRepository viewingRecordRepository;
    private final ViewingRecordImageRepository viewingRecordImageRepository;
    private final ViewingRecordPerkRepository viewingRecordPerkRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final PerkRepository perkRepository;

    @Transactional
    public ViewingRecordResponseDto createRecord(Long userId, ViewingRecordCreateRequestDto dto) {
        // 영화 존재 여부 확인
        if (!movieRepository.existsById(dto.getMovieId())) {
            throw new BusinessException(ErrorCode.MOVIE_NOT_FOUND);
        }

        // 극장 존재 여부 확인
        theaterRepository.findById(dto.getTheaterId())
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

        ViewingRecord v = ViewingRecord.builder()
                .userId(userId)
                .movieId(dto.getMovieId())
                .theaterId(dto.getTheaterId())
                .viewDate(dto.getViewDate())
                .review(dto.getReview())
                .isPublic(dto.getIsPublic() != null ? dto.getIsPublic() : false)
                .rating(dto.getRating())
                .build();

        ViewingRecord saved = viewingRecordRepository.save(v);

        // 이미지 URL들이 있으면 저장
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            for (String imageUrl : dto.getImageUrls()) {
                if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                    ViewingRecordImage image = ViewingRecordImage.builder()
                            .recordId(saved.getRecordId())
                            .imageUrl(imageUrl.trim())
                            .build();
                    viewingRecordImageRepository.save(image);
                }
            }
        }

        // 특전 ID들이 있으면 저장
        if (dto.getPerkIds() != null && !dto.getPerkIds().isEmpty()) {
            for (Long perkId : dto.getPerkIds()) {
                if (perkId != null && perkId > 0) {
                    // 특전 존재 여부 확인
                    perkRepository.findById(perkId)
                            .orElseThrow(() -> new BusinessException(ErrorCode.PERK_NOT_FOUND));
                    
                    ViewingRecordPerk viewingRecordPerk = ViewingRecordPerk.builder()
                            .recordId(saved.getRecordId())
                            .perkId(perkId)
                            .build();
                    viewingRecordPerkRepository.save(viewingRecordPerk);
                }
            }
        }

        return ViewingRecordResponseDto.from(saved);
    }

    @Transactional
    public ViewingRecordResponseDto updateRecord(Long userId, Long recordId, ViewingRecordUpdateRequestDto dto) {

        ViewingRecord origin = viewingRecordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECORD_NOT_FOUND));

        if (!Objects.equals(origin.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.RECORD_ACCESS_DENIED);
        }

        ViewingRecord updateRecord = ViewingRecord.builder()
                .recordId(origin.getRecordId())
                .userId(origin.getUserId())
                .movieId(origin.getMovieId())
                .theaterId(origin.getTheaterId())
                .viewDate(dto.getViewDate() != null ? dto.getViewDate() : origin.getViewDate())
                .review(dto.getReview() != null ? dto.getReview() : origin.getReview())
                .isPublic(dto.getIsPublic() != null ? dto.getIsPublic() : origin.getIsPublic())
                .rating(dto.getRating() != null ? dto.getRating() : origin.getRating())
                .build();

        ViewingRecord updated = viewingRecordRepository.update(updateRecord);

        return ViewingRecordResponseDto.from(updated);
    }

    @Transactional
    public void deleteRecord(Long userId, Long recordId) {
        ViewingRecord record = viewingRecordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECORD_NOT_FOUND));

        if (!Objects.equals(record.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.RECORD_ACCESS_DENIED);
        }

        viewingRecordRepository.delete(recordId);
    }

    @Transactional(readOnly = true)
    public List<ViewingRecordResponseDto> getMyRecords(Long userId) {

        return viewingRecordRepository.findAllByUserId(userId).stream()
                .map(ViewingRecordResponseDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HomeViewingRecordDto> getHomeRecords() {
        List<ViewingRecord> publicRecords = viewingRecordRepository.findAllPublicRecords();

        return publicRecords.stream()
                .map(this::convertToHomeDto)
                .collect(Collectors.toList());
    }

    private HomeViewingRecordDto convertToHomeDto(ViewingRecord record) {
        // 사용자 정보 조회
        User user = userRepository.findById(record.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 영화 정보 조회
        Movie movie = movieRepository.findById(record.getMovieId())
                .orElseThrow(() -> new BusinessException(ErrorCode.MOVIE_NOT_FOUND));

        // 극장 정보 조회
        Theater theater = theaterRepository.findById(record.getTheaterId())
                .orElseThrow(() -> new BusinessException(ErrorCode.THEATER_NOT_FOUND));

        // 관람기록 이미지들 조회
        List<String> images = viewingRecordImageRepository.findAllByRecordId(record.getRecordId()).stream()
                .map(ViewingRecordImage::getImageUrl)
                .collect(Collectors.toList());

        // 수집한 특전 목록 조회
        List<ViewingRecordPerk> viewingRecordPerks = viewingRecordPerkRepository.findAllByRecordId(record.getRecordId());
        List<HomeViewingRecordDto.PerkInfoDto> perks = viewingRecordPerks.stream()
                .map(vrp -> {
                    Perk perk = perkRepository.findById(vrp.getPerkId())
                            .orElse(null);
                    if (perk == null) {
                        return null;
                    }
                    return HomeViewingRecordDto.PerkInfoDto.builder()
                            .perkId(perk.getPerkId())
                            .name(perk.getName())
                            .build();
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // 작성 시간 계산 (상대 시간)
        String timeAgo = calculateTimeAgo(record.getCreatedAt());

        return HomeViewingRecordDto.builder()
                .recordId(record.getRecordId())
                .user(HomeViewingRecordDto.UserInfoDto.builder()
                        .userId(user.getUserId())
                        .name(user.getName())
                        .profileImage(user.getProfileImage())
                        .build())
                .timeAgo(timeAgo)
                .movie(HomeViewingRecordDto.MovieInfoDto.builder()
                        .movieId(movie.getMovieId())
                        .title(movie.getTitle())
                        .movieImage(movie.getImage())
                        .build())
                .rating(record.getRating())
                .viewDate(record.getViewDate())
                .theaterName(theater.getName())
                .review(record.getReview())
                .images(images)
                .perks(perks)
                .build();
    }

    @Transactional(readOnly = true)
    public ViewingRecordStatisticsDto getViewingRecordStatistics(Long userId) {
        List<ViewingRecord> allRecords = viewingRecordRepository.findAllByUserId(userId);

        // 총 관람 편수
        int totalCount = allRecords.size();

        // 이번 달 관람 편수
        LocalDate now = LocalDate.now();
        LocalDate firstDayOfMonth = now.withDayOfMonth(1);
        int thisMonthCount = (int) allRecords.stream()
                .filter(record -> record.getViewDate() != null && 
                        !record.getViewDate().isBefore(firstDayOfMonth))
                .count();

        // 평균 평점
        double averageRating = 0.0;
        List<Float> ratings = allRecords.stream()
                .map(ViewingRecord::getRating)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        
        if (!ratings.isEmpty()) {
            double sum = ratings.stream().mapToDouble(Float::doubleValue).sum();
            averageRating = sum / ratings.size();
            averageRating = Math.round(averageRating * 10.0) / 10.0;
        }

        return ViewingRecordStatisticsDto.builder()
                .totalCount(totalCount)
                .thisMonthCount(thisMonthCount)
                .averageRating(averageRating)
                .build();
    }

    @Transactional(readOnly = true)
    public List<HomeViewingRecordDto> getMyViewingRecords(Long userId, String movieTitle) {
        List<ViewingRecord> records = viewingRecordRepository.findAllByUserIdWithSearch(userId, movieTitle);

        return records.stream()
                .map(this::convertToHomeDto)
                .collect(Collectors.toList());
    }

    private String calculateTimeAgo(Timestamp createdAt) {
        if (createdAt == null) {
            return "알 수 없음";
        }

        LocalDateTime created = createdAt.toLocalDateTime();
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(created, now);

        long minutes = duration.toMinutes();
        long hours = duration.toHours();
        long days = duration.toDays();

        if (minutes < 1) {
            return "방금 전";
        } else if (minutes < 60) {
            return minutes + "분 전";
        } else if (hours < 24) {
            return hours + "시간 전";
        } else if (days < 7) {
            return days + "일 전";
        } else {
            return created.toLocalDate().toString();
        }
    }
}

