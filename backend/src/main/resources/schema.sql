DROP TABLE IF EXISTS perk_applications CASCADE;
DROP TABLE IF EXISTS inventories CASCADE;
DROP TABLE IF EXISTS theaters CASCADE;
DROP TABLE IF EXISTS perks CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS viewing_records CASCADE;
DROP TABLE IF EXISTS viewing_record_image CASCADE;
DROP TABLE IF EXISTS viewing_record_perk CASCADE;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
    movie_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    release_date DATE,
    genre VARCHAR(50),
    duration INT,
    image VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS events (
    event_id    BIGSERIAL PRIMARY KEY,
    movie_id    BIGINT NOT NULL,
    creator_id  BIGINT NOT NULL,
    title       VARCHAR(100) NOT NULL,
    start_date  DATE,
    end_date    DATE,
    week_no     INT,
    image       VARCHAR(500),

    CONSTRAINT fk_event_movie
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_event_creator
    FOREIGN KEY (creator_id) REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS perks (
    perk_id         BIGSERIAL PRIMARY KEY,
    event_id        BIGINT NOT NULL,
    name            VARCHAR(100) NOT NULL,
    type            VARCHAR(50),
    limit_per_user  INT,
    quantity        INT,
    description     VARCHAR(255),
    image           VARCHAR(500),

    CONSTRAINT fk_perk_event
    FOREIGN KEY (event_id) REFERENCES events(event_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS theaters (
    theater_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    manager_id BIGINT,

    CONSTRAINT fk_theater_user
    FOREIGN KEY (manager_id) REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventories (
    theater_id BIGINT NOT NULL,
    perk_id BIGINT NOT NULL,
    stock INT,
    status VARCHAR(20),

    CONSTRAINT pk_inventory PRIMARY KEY (theater_id, perk_id),

    CONSTRAINT fk_inventory_theater
    FOREIGN KEY (theater_id) REFERENCES theaters(theater_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_inventory_perk
    FOREIGN KEY (perk_id) REFERENCES perks(perk_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collections (
    user_id     BIGINT NOT NULL,
    perk_id     BIGINT NOT NULL,
    obtained_date DATE,
    quantity    INT NOT NULL,

    CONSTRAINT pk_collections PRIMARY KEY (user_id, perk_id),

    CONSTRAINT fk_collection_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_collection_perk
    FOREIGN KEY (perk_id) REFERENCES perks(perk_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS viewing_records (
    record_id   BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    movie_id    BIGINT NOT NULL,
    theater_id  BIGINT NOT NULL,
    view_date   DATE,
    review      TEXT,
    is_public   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating      FLOAT,

    CONSTRAINT fk_viewing_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_viewing_movie
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_viewing_theater
    FOREIGN KEY (theater_id) REFERENCES theaters(theater_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS viewingrecord_image (
    image_id   BIGSERIAL PRIMARY KEY,
    record_id  BIGINT NOT NULL,
    image_url  VARCHAR(500) NOT NULL,

    CONSTRAINT fk_viewingrecord_image_record
    FOREIGN KEY (record_id) REFERENCES viewing_records(record_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS viewing_record_perk (
    record_id  BIGINT NOT NULL,
    perk_id    BIGINT NOT NULL,

    PRIMARY KEY (record_id, perk_id),

    CONSTRAINT fk_viewingrecordperk_record
    FOREIGN KEY (record_id) REFERENCES viewing_records(record_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_viewingrecordperk_perk
    FOREIGN KEY (perk_id) REFERENCES perks(perk_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS perk_applications (
    application_id BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL,
    perk_id        BIGINT NOT NULL,
    theater_id     BIGINT NOT NULL,
    quantity       INT NOT NULL,
    applied_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_obtained    BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_application_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_application_perk
    FOREIGN KEY (perk_id) REFERENCES perks(perk_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_application_theater
    FOREIGN KEY (theater_id) REFERENCES theaters(theater_id)
    ON DELETE CASCADE
);

-- Views
DROP VIEW IF EXISTS user_collection_statistics CASCADE;
CREATE VIEW user_collection_statistics AS
SELECT 
    u.user_id,
    u.name AS user_name,
    COUNT(DISTINCT p.perk_id) AS total_perks,
    COUNT(DISTINCT CASE WHEN c.user_id IS NOT NULL THEN p.perk_id END) AS collected_perks,
    COUNT(DISTINCT e.movie_id) AS total_movies,
    COUNT(DISTINCT CASE WHEN c.user_id IS NOT NULL THEN e.movie_id END) AS collected_movies
FROM users u
CROSS JOIN perks p
JOIN events e ON p.event_id = e.event_id
LEFT JOIN collections c ON c.perk_id = p.perk_id AND c.user_id = u.user_id
GROUP BY u.user_id, u.name;

DROP VIEW IF EXISTS event_detail_view CASCADE;
CREATE VIEW event_detail_view AS
SELECT 
    e.event_id,
    e.title AS event_title,
    e.start_date,
    e.end_date,
    e.week_no,
    m.movie_id,
    m.title AS movie_title,
    m.genre,
    m.release_date,
    u.user_id AS creator_id,
    u.name AS creator_name,
    COUNT(DISTINCT p.perk_id) AS total_perks,
    COALESCE(SUM(p.quantity), 0) AS total_perk_quantity
FROM events e
JOIN movies m ON e.movie_id = m.movie_id
JOIN users u ON e.creator_id = u.user_id
LEFT JOIN perks p ON p.event_id = e.event_id
GROUP BY e.event_id, e.title, e.start_date, e.end_date, e.week_no, 
         m.movie_id, m.title, m.genre, m.release_date, u.user_id, u.name;

DROP VIEW IF EXISTS theater_inventory_summary CASCADE;
CREATE VIEW theater_inventory_summary AS
SELECT 
    t.theater_id,
    t.name AS theater_name,
    t.location,
    COUNT(DISTINCT i.perk_id) AS total_perks,
    SUM(CASE WHEN i.status = 'AVAILABLE' THEN i.stock ELSE 0 END) AS available_stock,
    SUM(CASE WHEN i.status = 'SOLD_OUT' THEN 1 ELSE 0 END) AS sold_out_count
FROM theaters t
LEFT JOIN inventories i ON i.theater_id = t.theater_id
GROUP BY t.theater_id, t.name, t.location;

-- Indexes for performance optimization
-- 인덱스 추가 기준:
-- 1. 외래키 컬럼: JOIN 연산이 빈번하게 발생하는 컬럼 (user_id, movie_id, event_id, theater_id, perk_id 등)
-- 2. WHERE 절에서 자주 사용되는 컬럼: email(로그인), role(권한 체크), title(검색), genre(필터링)
-- 3. ORDER BY에서 사용되는 컬럼: created_at(최신순 정렬), start_date/end_date(날짜 정렬)
-- 4. 부분 인덱스: 특정 조건의 데이터만 자주 조회하는 경우 (is_public = true인 공개 기록만 조회)
-- 5. 복합 인덱스: 여러 컬럼을 함께 조회하는 경우 (start_date, end_date로 기간 검색)

-- Users 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);  -- 로그인 시 email로 조회
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);      -- 역할별 권한 체크

-- Events 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_events_movie_id ON events(movie_id);      -- 영화별 이벤트 조회
CREATE INDEX IF NOT EXISTS idx_events_creator_id ON events(creator_id);  -- 생성자별 이벤트 조회
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);  -- 기간별 이벤트 검색 (복합 인덱스)

-- Perks 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_perks_event_id ON perks(event_id);  -- 이벤트별 특전 조회

-- Collections 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);  -- 사용자별 수집 현황 조회
CREATE INDEX IF NOT EXISTS idx_collections_perk_id ON collections(perk_id);   -- 특전별 수집자 조회

-- Viewing_records 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_viewing_records_user_id ON viewing_records(user_id);      -- 사용자별 관람 기록 조회
CREATE INDEX IF NOT EXISTS idx_viewing_records_movie_id ON viewing_records(movie_id);    -- 영화별 관람 기록 조회
CREATE INDEX IF NOT EXISTS idx_viewing_records_theater_id ON viewing_records(theater_id); -- 극장별 관람 기록 조회
CREATE INDEX IF NOT EXISTS idx_viewing_records_created_at ON viewing_records(created_at); -- 최신순 정렬
CREATE INDEX IF NOT EXISTS idx_viewing_records_public ON viewing_records(is_public) WHERE is_public = true;  -- 공개 기록만 조회 (부분 인덱스)

-- Inventories 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_inventories_theater_id ON inventories(theater_id);  -- 극장별 재고 조회
CREATE INDEX IF NOT EXISTS idx_inventories_perk_id ON inventories(perk_id);       -- 특전별 재고 조회

-- Perk_applications 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_perk_applications_user_id ON perk_applications(user_id);      -- 사용자별 신청 조회
CREATE INDEX IF NOT EXISTS idx_perk_applications_perk_id ON perk_applications(perk_id);      -- 특전별 신청자 조회
CREATE INDEX IF NOT EXISTS idx_perk_applications_theater_id ON perk_applications(theater_id); -- 극장별 신청 조회
CREATE INDEX IF NOT EXISTS idx_perk_applications_is_obtained ON perk_applications(is_obtained); -- 수령 여부 조회

-- Theaters 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_theaters_manager_id ON theaters(manager_id);  -- 관리자별 극장 조회

-- Movies 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);  -- 제목 검색 (ILIKE 사용)
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);  -- 장르별 필터링

-- Database Authorization (GRANT/REVOKE)
-- 역할별 데이터베이스 권한 설정
-- 참고: 실제 사용 시에는 운영 환경에 맞게 사용자와 역할을 생성해야 합니다.

-- COLLECTOR 역할: 자신의 데이터만 조회/수정 가능
-- GRANT SELECT, INSERT, UPDATE ON collections TO collector_role;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON viewing_records TO collector_role;
-- GRANT SELECT ON movies, events, perks, theaters, inventories TO collector_role;

-- THEATER 역할: 자신의 극장 재고만 관리 가능
-- GRANT SELECT, INSERT, UPDATE ON inventories TO theater_role;
-- GRANT SELECT, UPDATE ON theaters TO theater_role;
-- GRANT SELECT ON movies, events, perks, collections TO theater_role;

-- CREATOR 역할: 자신이 생성한 이벤트와 특전만 관리 가능
-- GRANT SELECT, INSERT, UPDATE, DELETE ON events TO creator_role;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON perks TO creator_role;
-- GRANT SELECT, INSERT, UPDATE ON inventories TO creator_role;
-- GRANT SELECT ON movies, theaters, collections TO creator_role;

-- ADMIN 역할: 모든 권한
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_role;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_role;

-- Transaction 예시 (명시적 트랜잭션)
-- Spring의 @Transactional 어노테이션은 자동으로 BEGIN/COMMIT/ROLLBACK을 처리합니다.
-- 하지만 명시적으로 SQL 트랜잭션을 사용하는 예시:
/*
BEGIN;
    -- 재고 차감
    UPDATE inventories 
    SET stock = stock - 1, status = CASE WHEN stock - 1 <= 0 THEN 'SOLD_OUT' ELSE status END
    WHERE theater_id = ? AND perk_id = ?;
    
    -- 수집 현황 추가/업데이트
    INSERT INTO collections (user_id, perk_id, quantity, obtained_date)
    VALUES (?, ?, 1, CURRENT_DATE)
    ON CONFLICT (user_id, perk_id) 
    DO UPDATE SET quantity = collections.quantity + 1;
COMMIT;
-- 오류 발생 시 자동으로 ROLLBACK
*/

