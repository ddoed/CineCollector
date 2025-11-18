package com.example.cinecollector.user.controller;

import com.example.cinecollector.common.jwt.dto.TokenDto;
import com.example.cinecollector.common.response.ApiResponse;
import com.example.cinecollector.common.security.CustomUserDetails;
import com.example.cinecollector.user.dto.LoginRequestDto;
import com.example.cinecollector.user.dto.UserCreateRequestDto;
import com.example.cinecollector.user.dto.UserResponseDto;
import com.example.cinecollector.user.entity.User;
import com.example.cinecollector.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenDto>> login(
            @Valid @RequestBody LoginRequestDto loginRequestDto
    ) {
        TokenDto tokenDto = userService.login(loginRequestDto.getEmail(), loginRequestDto.getPassword());
        return ResponseEntity.ok(ApiResponse.success(tokenDto));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<TokenDto>> signup(
            @Valid @RequestBody UserCreateRequestDto requestDto
    ) {
        TokenDto tokenDto = userService.signup(requestDto.getName(), requestDto.getEmail(), requestDto.getPassword());
        return ResponseEntity.ok(ApiResponse.success(tokenDto));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = userDetails.getUser();
        UserResponseDto userResponseDto = userService.getUserInfo(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(userResponseDto));
    }
}
