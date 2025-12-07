package com.example.cinecollector.movie.service;

import com.example.cinecollector.movie.dto.MovieResponseDto;
import com.example.cinecollector.movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    public List<MovieResponseDto> getAllMovie() {
        return movieRepository.findAll().stream()
                .map(MovieResponseDto::from)
                .toList();
    }
}


