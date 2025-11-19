package com.example.cinecollector.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // 공통
    INVALID_INPUT(400, "COMMON-001", "잘못된 입력 값입니다."),
    INVALID_FORMAT(400, "COMMON-002", "요청 본문의 형식이 올바르지 않습니다."),
    INTERNAL_SERVER_ERROR(500, "COMMON-999", "서버 에러가 발생했습니다."),

    // 유저
    USER_NOT_FOUND(404, "USER-001", "사용자를 찾을 수 없습니다."),
    USER_ALREADY_EXISTS(400, "USER-002", "이미 존재하는 사용자입니다." ),

    // 인증/인가
    UNAUTHORIZED(401, "AUTH-001", "인증이 필요합니다."),
    TOKEN_EXPIRED(401, "AUTH-002", "토큰이 만료되었습니다."),
    INVALID_TOKEN(401, "AUTH-003", "유효하지 않은 토큰입니다."),
    FORBIDDEN(403, "AUTH-004", "접근 권한이 없습니다."),
    INVALID_PASSWORD(401, "AUTH-005", "비밀번호가 일치하지 않습니다."),

    // 영화
    MOVIE_NOT_FOUND(404, "MOVIE-001", "영화를 찾을 수 없습니다."),

    // 이벤트
    EVENT_NOT_FOUND(404, "EVENT-001", "이벤트를 찾을 수 없습니다."),
    EVENT_ACCESS_DENIED(403, "EVENT-002", "해당 이벤트에 대한 접근 권한이 없습니다." ),

    // 특전
    PERK_NOT_FOUND(404, "PERK-001" , "특전을 찾을 수 없습니다." ),
    PERK_ACCESS_DENIED(403, "PERK-002" , "해당 특전에 대한 접근 권한이 없습니다." ),

    // 극장
    THEATER_NOT_FOUND(404, "THEATER-001", "극장을 찾을 수 없습니다." ),
    THEATER_ACCESS_DENIED(403, "THEATER-002", "극장에 대한 접근 권한이 없습니다." ),
    THEATER_ALREADY_EXISTS(400, "THEATER-003" , "해당 관리자의 극장이 이미 존재합니다." ),

    // 특전 재고
    INVENTORY_NOT_FOUND(404, "INVENTORY-001" , "해당 재고를 찾을 수 없습니다." ),

    // 도감
    COLLECTION_NOT_FOUND(404, "COLLECTION-001" , "도감을 찾을 수 없습니다." ),

    // 관람 기록
    RECORD_NOT_FOUND(404, "RECORD-001" , "관람기록을 찾을 수 없습니다." ),
    RECORD_ACCESS_DENIED(403, "RECORD-002" , "해당 관람기록에 대한 접근 권한이 없습니다." );


    private final int status;
    private final String code;
    private final String message;
}

