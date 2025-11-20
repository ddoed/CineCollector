package com.example.cinecollector.movie.service;

import com.example.cinecollector.movie.dto.*;
import com.example.cinecollector.movie.repository.MovieCollectionRepository;
import com.example.cinecollector.movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieCollectionService {

    private final MovieCollectionRepository repository;
    private final MovieRepository movieRepository;

    public MovieCollectionResponseDto getMovieCollection(Long userId, Long movieId) {

        // 영화 제목
        String title = movieRepository.findMovieTitle(movieId);

        // 전체 perk raw 조회
        List<Map<String, Object>> rows = repository.findMoviePerkRaw(userId, movieId);

        // week_no 기준 그룹핑
        Map<Integer, List<Map<String, Object>>> weekGroups =
                rows.stream().collect(Collectors.groupingBy(r -> (Integer) r.get("week_no")));

        List<MovieCollectionWeekDto> weeks = new ArrayList<>();

        // 수집률 계산용 SET (중복 제거)
        Set<String> totalTypes = new HashSet<>();
        Set<String> collectedTypes = new HashSet<>();

        for (Integer weekNo : weekGroups.keySet()) {

            List<Map<String, Object>> weekRows = weekGroups.get(weekNo);

            LocalDate start = ((Date) weekRows.get(0).get("start_date")).toLocalDate();
            LocalDate end = ((Date) weekRows.get(0).get("end_date")).toLocalDate();
            String category = determineCategory(start, end, weekNo);

            // creator 그룹핑
            Map<Long, List<Map<String, Object>>> creatorGroups =
                    weekRows.stream().collect(Collectors.groupingBy(r -> (Long) r.get("creator_id")));

            List<MovieCollectionCreatorDto> creators = new ArrayList<>();
            boolean weekCollected = false;

            for (Long creatorId : creatorGroups.keySet()) {

                List<Map<String, Object>> creatorRows = creatorGroups.get(creatorId);
                String creatorName = (String) creatorRows.get(0).get("creator_name");

                List<MovieCollectionPerkDto> perks = new ArrayList<>();

                for (Map<String, Object> row : creatorRows) {

                    String perkName = (String) row.get("perk_name");
                    String type = (String) row.get("perk_type");
                    boolean collected = (boolean) row.get("collected");

                    // Creator 무관하게 동일한 특전은 하나로 취급하는 Key 생성
                    String uniqueKey = weekNo + "_" + category + "_" + type + "_" + perkName;

                    // 전체 특전 종류
                    totalTypes.add(uniqueKey);

                    // 수집한 특전 종류
                    if (collected) {
                        collectedTypes.add(uniqueKey);
                        weekCollected = true; // 주차 내에 하나라도 수집된 경우 표시
                    }

                    perks.add(
                            MovieCollectionPerkDto.builder()
                                    .perkId((Long) row.get("perk_id"))
                                    .perkName(perkName)
                                    .type(type)
                                    .collected(collected)
                                    .build()
                    );
                }

                creators.add(
                        MovieCollectionCreatorDto.builder()
                                .creatorId(creatorId)
                                .creatorName(creatorName)
                                .perks(perks)
                                .build()
                );
            }

            weeks.add(
                    MovieCollectionWeekDto.builder()
                            .weekNo(weekNo)
                            .category(category)
                            .weekCollected(weekCollected)
                            .creators(creators)
                            .build()
            );
        }

        // 최종 수집률 계산
        double collectionRate = 0.0;
        if (!totalTypes.isEmpty()) {
            collectionRate = (double) collectedTypes.size() / totalTypes.size();
        }
        collectionRate = Math.round(collectionRate * 100) / 100.0;

        return MovieCollectionResponseDto.builder()
                .movieId(movieId)
                .movieTitle(title)
                .collectionRate(collectionRate)
                .weeks(weeks)
                .build();
    }

    private String determineCategory(LocalDate start, LocalDate end, Integer weekNo) {
        if (weekNo == null) return "NORMAL";
        if (start.equals(end)) return "DAY_ONLY";

        int dow = start.getDayOfWeek().getValue(); // 1=Mon … 7=Sun
        if (dow == 6 || dow == 7) return "WEEKEND";

        return "WEEKDAY";
    }

    public List<MovieCollectionSummaryDto> getMyCollectedMovies(Long userId) {

        // 내가 가진 특전이 속한 영화들
        List<Long> movieIds = repository.findCollectedMovieIds(userId);

        List<MovieCollectionSummaryDto> result = new ArrayList<>();

        for (Long movieId : movieIds) {
            MovieCollectionResponseDto full = getMovieCollection(userId, movieId);

            result.add(
                    MovieCollectionSummaryDto.builder()
                            .movieId(movieId)
                            .movieTitle(full.getMovieTitle())
                            .collectionRate(full.getCollectionRate())
                            .build()
            );
        }

        return result;
    }

    public PerkCollectionStatisticsDto getPerkCollectionStatistics(Long userId) {
        Map<String, Object> stats = repository.getPerkCollectionStatistics(userId);

        Integer totalPerks = ((Number) stats.get("total_perks")).intValue();
        Integer collectedPerks = ((Number) stats.get("collected_perks")).intValue();

        Double collectionRate = 0.0;
        if (totalPerks > 0) {
            collectionRate = (double) collectedPerks / totalPerks * 100;
            collectionRate = Math.round(collectionRate * 10.0) / 10.0;
        }

        return PerkCollectionStatisticsDto.builder()
                .totalPerks(totalPerks)
                .collectedPerks(collectedPerks)
                .collectionRate(collectionRate)
                .overallProgress(collectionRate)
                .build();
    }

    public List<PerkCollectionListDto> getPerkCollectionList(Long userId, String movieTitle, String filter) {
        List<Map<String, Object>> movieList = repository.findPerkCollectionList(userId, movieTitle, filter);

        return movieList.stream()
                .map(movie -> {
                    Long movieId = ((Number) movie.get("movie_id")).longValue();
                    String title = (String) movie.get("movie_title");
                    String movieImage = (String) movie.get("movie_image");
                    Integer totalCount = ((Number) movie.get("total_count")).intValue();
                    Integer collectedCount = ((Number) movie.get("collected_count")).intValue();

                    Double completionRate = 0.0;
                    if (totalCount > 0) {
                        completionRate = (double) collectedCount / totalCount * 100;
                        completionRate = Math.round(completionRate * 10.0) / 10.0;
                    }

                    // 해당 영화의 특전 목록 조회
                    List<Map<String, Object>> perkRows = repository.findPerksByMovieId(userId, movieId);
                    List<PerkCollectionListDto.PerkCollectionItemDto> perks = perkRows.stream()
                            .map(perk -> PerkCollectionListDto.PerkCollectionItemDto.builder()
                                    .perkId(((Number) perk.get("perk_id")).longValue())
                                    .weekNo((Integer) perk.get("week_no"))
                                    .name((String) perk.get("name"))
                                    .type((String) perk.get("type"))
                                    .image((String) perk.get("image"))
                                    .collected((Boolean) perk.get("collected"))
                                    .build())
                            .collect(Collectors.toList());

                    return PerkCollectionListDto.builder()
                            .movieId(movieId)
                            .movieTitle(title)
                            .movieImage(movieImage)
                            .collectedCount(collectedCount)
                            .totalCount(totalCount)
                            .completionRate(completionRate)
                            .perks(perks)
                            .build();
                })
                .collect(Collectors.toList());
    }

}
