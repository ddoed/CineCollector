package com.example.cinecollector.user.service;

import com.example.cinecollector.common.exception.BusinessException;
import com.example.cinecollector.common.exception.ErrorCode;
import com.example.cinecollector.common.jwt.dto.TokenDto;
import com.example.cinecollector.common.jwt.service.JwtService;
import com.example.cinecollector.user.dto.UserResponseDto;
import com.example.cinecollector.user.entity.Role;
import com.example.cinecollector.user.entity.User;
import com.example.cinecollector.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public TokenDto signup(String name, String email, String rawPassword) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new BusinessException(ErrorCode.USER_ALREADY_EXISTS);
        }

        String encoded = passwordEncoder.encode(rawPassword);
        User user = User.builder()
                .name(name)
                .email(email)
                .password(encoded)
                .role(Role.COLLECTOR)
                .build();

        User saved = userRepository.save(user);
        TokenDto token = jwtService.generateToken(saved);

        return token;
    }

    public TokenDto login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_PASSWORD);
        }

        TokenDto token = jwtService.generateToken(user);

        return token;
    }

    public UserResponseDto getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        return UserResponseDto.builder()
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}

