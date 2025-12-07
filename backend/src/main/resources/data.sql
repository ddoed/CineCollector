-- User
-- ROLE COLLECTOR
INSERT INTO users (name, email, password, role, profile_image, created_at)
VALUES ('collector1', 'collector1@example.com', '$2a$10$.2SNxhkEFlwzmKn7BspF/uR3MVM93DkWjBTVMAtpiaZJATWuECXQ6', 'COLLECTOR', NULL, CURRENT_TIMESTAMP);
INSERT INTO users (name, email, password, role, profile_image, created_at)
VALUES ('collector2', 'collector2@example.com', '$2a$10$fC7C3y/l6lbWfWUegnd02.8L4Lcu2EJ0m4/B2IQMIaxN3qOcHjxuu', 'COLLECTOR', NULL, CURRENT_TIMESTAMP);
INSERT INTO users (name, email, password, role, profile_image, created_at)
VALUES ('collector3', 'collector3@example.com', '$2a$10$8pnd066IGjV9JEWxpH2OHOKqjcoqlXajrhgHvhe7UrMo/u.V4EVsW', 'COLLECTOR', NULL, CURRENT_TIMESTAMP);

-- ROLE THEATER
INSERT INTO users (name, email, password, role, profile_image, created_at)
VALUES ('theater1', 'theater1@example.com', '$2a$10$7oXu/s0X5XssU8vfJrOZy.BFJWuKzyaFJiodAjwGsb5p6PQOuyHiW', 'THEATER', NULL, CURRENT_TIMESTAMP);
INSERT INTO users (name, email, password, role, profile_image, created_at)
VALUES ('theater2', 'theater2@example.com', '$2a$10$jEcexuyQBFsrO3F4e/WjyeyViTUCIx2BaUEo7ZI3JJlUBQsHhh5W6', 'THEATER', NULL, CURRENT_TIMESTAMP);
INSERT INTO users (name, email, password, role, profile_image, created_at)
VALUES ('theater3', 'theater3@example.com', '$2a$10$eMReVVxk.PBtKkZ/NmqA7unItB8Lw3QlO3M5jcbz3YbHtiNQnttm.', 'THEATE6b7nm9.R', NULL, CURRENT_TIMESTAMP);

-- ROLE CREATOR
INSERT INTO users (name, email, password, role, profile_image, created_at)
VALUES ('메가박스', 'creator1@example.com', '$2a$10$ouO8K.BHkqViMPr61e/IDeDounR82aXBWGAGhXHcMWNyyt2LwAGpa', 'CREATOR', NULL, CURRENT_TIMESTAMP);
INSERT INTO users (name, email, password, role, profile_image, created_at)
VALUES ('CGV', 'creator2@example.com', '$2a$10$EmF166nxx9WGtga31jVyfuzST/qujcf2PJ/0EEtNfVopIGqMQjW0i', 'CREATOR', NULL, CURRENT_TIMESTAMP);
INSERT INTO users (name, email, password, role, profile_image, created_at)
VALUES ('롯데시네마', 'creator3@example.com', '$2a$10$7UN8avfY3.zMOP.6B1mzgexOfOfvcYh3dv4RrwPoH9BiXnBiBkQru', 'CREATOR', NULL, CURRENT_TIMESTAMP);

-- ROLE ADMIN
INSERT INTO users (name, email, password, role, profile_image, created_at)
VALUES ('admin', 'admin@example.com', '$2a$10$WIln/4.06LBahSnDORaY..1cOrHd.RUy.UZKiP9zTPxa1mrgTQzNu', 'ADMIN', NULL, CURRENT_TIMESTAMP);

-- Movies
INSERT INTO movies (title, release_date, genre, duration, image)
VALUES ('8번 출구', '2025-10-22', '공포(호러), 스릴러', 95, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/8%EB%B2%88%EC%B6%9C%EA%B5%AC_%EC%98%81%ED%99%94.jpg');
INSERT INTO movies (title, release_date, genre, duration, image)
VALUES ('주토피아 2', '2025-11-26', '애니메이션', 108, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%A3%BC%ED%86%A0%ED%94%BC%EC%95%84_%EC%98%81%ED%99%94.jpg');
INSERT INTO movies (title, release_date, genre, duration, image)
VALUES ('나우 유 씨 미 3', '2025-11-12', '범죄, 액션', 112, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EB%82%98%EC%9A%B0%EC%9C%A0%EC%94%A8%EB%AF%B8_%EC%98%81%ED%99%94.jpg');
INSERT INTO movies (title, release_date, genre, duration, image)
VALUES ('극장판 체인소 맨-레제편', '2025-09-24', '액션, 애니메이션, 어드벤처', 100, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%B2%B4%EC%9D%B8%EC%86%8C%EB%A7%A8_%EC%98%81%ED%99%94.jpg');
INSERT INTO movies (title, release_date, genre, duration, image)
VALUES ('극장판 주술회전: 회옥·옥절', '2025-10-16', '애니메이션', 110, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%A3%BC%EC%88%A0%ED%9A%8C%EC%A0%84_%EC%98%81%ED%99%94.jpg');

-- Events 예시 데이터 (creator_id는 users의 user_id 참조)
INSERT INTO events (movie_id, creator_id, title, start_date, end_date, week_no, image)
VALUES (1, 7, '<8번 출구> 개봉5주차 주중 현장 증정 이벤트', '2025-11-19', '2025-12-21', 5, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/8%EB%B2%88%EC%B6%9C%EA%B5%AC_%EC%A3%BC%EC%A4%91_%EC%9D%B4%EB%B2%A4%ED%8A%B8.jpg');
INSERT INTO events (movie_id, creator_id, title, start_date, end_date, week_no, image)
VALUES (1, 7, '<8번 출구> 개봉5주차 주말 현장 증정 이벤트', '2025-11-22', '2025-12-23', 5, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/8%EB%B2%88%EC%B6%9C%EA%B5%AC_%EC%A3%BC%EB%A7%90_%EC%9D%B4%EB%B2%A4%ED%8A%B8.jpg');
INSERT INTO events (movie_id, creator_id, title, start_date, end_date, week_no, image)
VALUES (2, 8, '<주토피아 2> 1주차 현장 이벤트', '2025-11-26', '2025-12-02', 1, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%A3%BC%ED%86%A0%ED%94%BC%EC%95%84_%EC%9D%B4%EB%B2%A4%ED%8A%B8.jpg');
INSERT INTO events (movie_id, creator_id, title, start_date, end_date, week_no, image)
VALUES (3, 9, '<나우 유 씨 미 3> 2주차 현장 증정 이벤트', '2025-12-19', '2025-11-25', 2, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EB%82%98%EC%9A%B0%EC%9C%A0%EC%94%A8%EB%AF%B8_%EC%9D%B4%EB%B2%A4%ED%8A%B8.jpg');
INSERT INTO events (movie_id, creator_id, title, start_date, end_date, week_no, image)
VALUES (4,7,'<극장판 체인소 맨: 레제편> 개봉 9주차 주중 현장 증정 이벤트','2025-11-19','2025-11-21',9,'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%B2%B4%EC%9D%B8%EC%86%8C%EB%A7%A8_%EC%9D%B4%EB%B2%A4%ED%8A%B8.jpg');
INSERT INTO events (movie_id, creator_id, title, start_date, end_date, week_no, image)
VALUES (5,9,'<극장판 주술회전: 회옥·옥절> 6주차 주말 현장 증정 이벤트','2025-11-22','2025-11-25',6,'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%A3%BC%EC%88%A0%ED%9A%8C%EC%A0%84_%EC%9D%B4%EB%B2%A4%ED%8A%B8.jpg');

-- Perks 예시 데이터 (event_id는 events의 event_id 참조)
-- 8번 출구 주중 특전
INSERT INTO perks (event_id, name, type, limit_per_user, quantity, description, image)
VALUES (1, '이상현상 아크릴 스탠드', '아크릴 스탠드', NULL, 500, '<8번 출구> 이상현상 아크릴 스탠드', 'https://comtogether.s3.ap-southeast-2.amazonaws.com/8%EB%B2%88%EC%B6%9C%EA%B5%AC_%EC%A3%BC%EC%A4%91_%ED%8A%B9%EC%A0%84.png');
-- 8번 출구 주말 특전
INSERT INTO perks (event_id, name, type, limit_per_user, quantity, description, image)
VALUES (2, '암흑 포스터', '포스터', NULL, 500, '<8번 출구> 암흑 포스터(A3, 야광 후가공)', 'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/8%EB%B2%88%EC%B6%9C%EA%B5%AC_%EC%A3%BC%EB%A7%90_%ED%8A%B9%EC%A0%84.png');
-- 주토피아 1주차 특전
INSERT INTO perks (event_id, name, type, limit_per_user, quantity, description, image)
VALUES (3, '오리지널 포스터', '포스터', NULL, 3000, '<주토피아 2> 오리지널 포스터(A3) 증정','https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%A3%BC%ED%86%A0%ED%94%BC%EC%95%84_%ED%8A%B9%EC%A0%84.png');
-- 나우 유 씨미 특전
INSERT INTO perks (event_id, name, type, limit_per_user, quantity, description, image)
VALUES (4,'일러스트 포스터','포스터',NULL,3000,'<나우 유 씨 미 3> 일러스트 포스터','https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EB%82%98%EC%9A%B0%EC%9C%A0%EC%94%A8%EB%AF%B8_%ED%8A%B9%EC%A0%84.png');
-- 체인소맨 주중 특전
INSERT INTO perks (event_id, name, type, limit_per_user, quantity, description, image)
VALUES (5,'일러스트 굿즈','일러스트',NULL,2000,'<극장판 체인소 맨: 레제편> 후지모토 타츠키 일러스트 굿즈(덴지&레제)','https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%B2%B4%EC%9D%B8%EC%86%8C%EB%A7%A8_%ED%8A%B9%EC%A0%84.png');
INSERT INTO perks (event_id, name, type, limit_per_user, quantity, description, image)
VALUES (6,'푸르른 봄 포스터','포스터',NULL,2000,'<극장판 주술회전: 회옥·옥절> 푸르른 봄 포스터 (A3)','https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%A3%BC%EC%88%A0%ED%9A%8C%EC%A0%84_%ED%8A%B9%EC%A0%84.png');

-- Theaters 예시 데이터 (manager_id는 users의 user_id 참조)
-- 8번 출구 증정 지점
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 세종나성', '세종특별자치시 나성로 38', 4);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 송도(트리플스트리트)', '인천광역시 연수구 D동 송도과학로16번길 33-4 2~4층 트리플스트리트', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 홍대', '서울특별시 마포구 양화로 147 아일렉스 7층', 5);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 대전중앙로', '대전광역시 중구 중앙로 126', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 수원AK플라자(수원역)', '경기도 수원시 팔달구 덕영대로 924', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 고양스타필드', '세종특별자치시 나성로 38', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 남양주현대아울렛스페이스원', '인천광역시 연수구 D동 송도과학로16번길 33-4 2~4층 트리플스트리트', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 더부티크목동현대백화점', '서울특별시 마포구 양화로 147 아일렉스 7층', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 마곡', '대전광역시 중구 중앙로 126', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 센트럴', '서울특별시 서초구 신반포로 176', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 수원인계', '경기도 수원시 팔달구 효원로 278 4 6층', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 하남스타필드', '경기도 하남시 미사대로 750', 6);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 강남', '서울 서초구 강남대로 438 스타플렉스', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 거제', '경남 거제시 장승포로 14', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 건대입구', '서울 광진구 아차산로 262', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 계양', '인천 계양구 장제로 772', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 광교', '경기 수원시 영통구 광교호수공원로 80', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 광주첨단', '광주 광산구 첨단내촌로 29', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 구로', '서울 구로구 구로중앙로 152', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 대구', '대구 동구 동부로 149', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 대구한일', '대구 중구 국채보상로 585', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 동대문', '서울 중구 장충단로 229', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 동수원', '경기 수원시 팔달구 동수원로 328', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 목포평화광장', '전남 목포시 평화로 124', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 부천', '경기 부천시 길주로 297', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 서면 삼정타워', '부산 부산진구 동천로 4', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 성신여대입구', '서울 성북구 동소문로 102', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 센텀시티', '부산 해운대구 센텀남대로 35', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 소풍', '경기 부천시 송내대로 239', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 스타필드시티위례', '경기 하남시 위례대로 200', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 신촌아트레온', '서울 서대문구 신촌로 129', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 여의도', '서울 영등포구 국제금융로 10', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 영등포', '서울 영등포구 영중로 15 타임스퀘어', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 오리', '경기 성남시 분당구 오리로 105', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 왕십리', '서울 성동구 왕십리광장로 17', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 용산아이파크몰', '서울 용산구 한강대로23길 55', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 울산삼산', '울산 남구 삼산로 175', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 의정부', '경기 의정부시 시민로 80', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 인천', '인천 중구 신포로 27', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 일산', '경기 고양시 일산동구 중앙로 1207', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 전주효자', '전북 전주시 완산구 용머리로 31', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 제주', '제주 제주시 서해안로 270', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 천안터미널', '충남 천안시 동남구 만남로 43', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 천안펜타포트', '충남 천안시 서북구 공원로 196', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 천호', '서울 강동구 천호대로 997', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 청주지웰시티', '충북 청주시 흥덕구 대농로 17', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 판교', '경기 성남시 분당구 판교역로 146', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('CGV 홍대', '서울 마포구 양화로 153', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 건대입구', '서울 광진구 아차산로 230', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 김포공항', '서울 강서구 하늘길 38 롯데몰 김포공항', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 노원', '서울 노원구 동일로 1414', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 신림', '서울 관악구 신림로 330', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 영등포', '서울 영등포구 경인로 846', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 용산', '서울 용산구 한강대로23길 55 아이파크몰', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 월드타워', '서울 송파구 올림픽로 300 롯데월드타워', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 은평(롯데몰)', '서울 은평구 통일로 1050', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 청량리', '서울 동대문구 왕산로 214 롯데백화점', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 홍대입구', '서울 마포구 양화로 176', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 부천(신중동)', '경기 부천시 길주로 297', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 산본피트인', '경기 군포시 번영로 485', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 성남중앙(신흥)', '경기 성남시 수정구 산성대로 337', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 수원(수원역)', '경기 수원시 팔달구 덕영대로 924 AK플라자', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 수지', '경기 용인시 수지구 성복2로 38', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 안산', '경기 안산시 단원구 고잔로 108', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 안양(안양역)', '경기 안양시 만안구 장내로 139', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 파주운정', '경기 파주시 청암로 17', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 평촌(범계역)', '경기 안양시 동안구 시민대로 180', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 부평역사', '인천 부평구 광장로 18', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 인천아시아드', '인천 서구 봉수대로 806', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 대전센트럴', '대전 서구 대덕대로 211', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 청주용암', '충북 청주시 상당구 용암로 129', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 광주(백화점)', '광주 동구 독립로 268', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 수완(아울렛)', '광주 광산구 장신로 98', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 군산몰', '전북 군산시 조촌동 790-1', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 전주(백화점)', '전북 전주시 완산구 온고을로 2', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 김해부원', '경남 김해시 김해대로 2342', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 진주혁신(롯데몰)', '경남 진주시 사들로 136', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 창원', '경남 창원시 성산구 중앙대로 124', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 광복', '부산 중구 중앙대로 2 롯데백화점', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 동래', '부산 동래구 충렬대로 187', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 부산본점', '부산 부산진구 가야대로 772', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 센텀시티', '부산 해운대구 센텀남대로 35', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 동성로', '대구 중구 동성로 25', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 상인', '대구 달서구 상인로 102', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 성서', '대구 달서구 달구벌대로 1610', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('롯데시네마 원주무실', '강원 원주시 능라동길 59', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 김포한강신도시', '경기 김포시 김포한강2로 41', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 대구신세계(동대구)', '대구 동구 동부로 149 신세계백화점', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 대전신세계아트앤사이언스', '대전 유성구 엑스포로 1', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 목동', '서울 양천구 목동서로 159-1', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 사상', '부산 사상구 광장로 17', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 수원스타필드', '경기 수원시 장안구 창훈로 7', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 이수', '서울 동작구 동작대로 89', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 코엑스', '서울 강남구 영동대로 513', NULL);
INSERT INTO theaters (name, location, manager_id) VALUES ('메가박스 강남', '서울 강남구 강남대로 438', NULL);

-- Inventories 예시 데이터 (theater_id는 theaters의 theater_id, perk_id는 perks의 perk_id 참조)
-- 8번 출구 주중 증정 지점 특전 재고
INSERT INTO inventories (theater_id, perk_id, stock, status)
VALUES (1, 1, 100, 'AVAILABLE');
-- 8번 출구 주말 증정 지점 특전 재고
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (6, 2, 10, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (7, 2, 10, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (4, 2, 10, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (8, 2, 10, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (9, 2, 10, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (1, 2, 10, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (10, 2, 10, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (2, 2, 10, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (5, 2, 10, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (11, 2, 10, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (12, 2, 10, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (3, 2, 10, 'AVAILABLE');
-- 주토피아 1주차 특전 증정 지점 재고
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (13, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (14, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (15, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (16, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (17, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (18, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (19, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (20, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (21, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (22, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (23, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (24, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (25, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (26, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (27, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (28, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (29, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (30, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (31, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (32, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (33, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (34, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (35, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (36, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (37, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (38, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (39, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (40, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (41, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (42, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (43, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (44, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (45, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (46, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (47, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (48, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (49, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (50, 3, 100, 'AVAILABLE');
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (51, 3, 100, 'AVAILABLE');
--나우 유 씨미 특전 증정 지점 재고
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (52, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (53, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (54, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (55, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (56, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (57, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (58, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (59, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (60, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (61, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (62, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (63, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (64, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (65, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (66, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (67, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (68, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (69, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (70, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (71, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (72, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (73, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (74, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (75, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (76, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (77, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (78, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (79, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (80, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (81, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (82, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (83, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (84, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (85, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (86, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (87, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (88, 4, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (89, 4, 100, 'AVAILABLE');
-- 체인소맨 주중 특전 증정 지점 재고
INSERT INTO inventories (theater_id, perk_id, stock, status) VALUES (6, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (52, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (53, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (54, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (4, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (55, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (56, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (1, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (2, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (5, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (57, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (11, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (58, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (59, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (12, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (3, 5, 100, 'AVAILABLE');
INSERT INTO inventories VALUES (60, 5, 100, 'AVAILABLE');
-- 주술회전 특전 증정지점 재고
INSERT INTO inventories VALUES (48, 6, 100, 'AVAILABLE');

------------------여기부턴 랜덤
-- Collections 예시 데이터 (user_id는 users의 user_id, perk_id는 perks의 perk_id 참조)
INSERT INTO collections (user_id, perk_id, obtained_date, quantity)
VALUES (1, 1, CURRENT_DATE, 1);

-- Viewing Records 예시 데이터 (user_id는 users의 user_id, movie_id는 movies의 movie_id, theater_id는 theaters의 theater_id 참조)
INSERT INTO viewing_records (user_id, movie_id, theater_id, view_date, review, is_public, rating, created_at)
VALUES (1, 1, 1, '2024-03-05', '압도적인 스케일과 영상미에 완전히 빠져들었습니다.', true, 4.8, CURRENT_TIMESTAMP);

INSERT INTO viewing_records (user_id, movie_id, theater_id, view_date, review, is_public, rating, created_at)
VALUES (2, 4, 1, '2025-10-31', '예쁜데 창문이 반투명이라 아쉽네요..', true, 4.5, CURRENT_TIMESTAMP);

INSERT INTO viewing_records (user_id, movie_id, theater_id, view_date, review, is_public, rating, created_at)
VALUES (3, 5, 1, '2025-11-22', '포스터가 너무 예뻐요..! 마지막 특전이라 그런지 수량을 적게 풀었네요ㅠ', true, 5.0, CURRENT_TIMESTAMP);

INSERT INTO viewing_records (user_id, movie_id, theater_id, view_date, review, is_public, rating, created_at)
VALUES (1, 1, 1, '2024-03-05', '압도적인 스케일과 영상미에 완전히 빠져들었습니다.', true, 4.8, CURRENT_TIMESTAMP);

-- Viewing Record Images 예시 데이터 (record_id는 viewing_records의 record_id 참조)

INSERT INTO viewingrecord_image (record_id, image_url)
VALUES (2, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%B9%B4%ED%8E%98%ED%8F%AC.jpg');

INSERT INTO viewingrecord_image (record_id, image_url)
VALUES (3, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%85%94%ED%8F%AC2.jpg');
INSERT INTO viewingrecord_image (record_id, image_url)
VALUES (3, 'https://comtogether.s3.ap-southeast-2.amazonaws.com/string/%EC%85%94%ED%8F%AC.jpg');


-- Viewing Record Perks 예시 데이터 (record_id는 viewing_records의 record_id, perk_id는 perks의 perk_id 참조)
INSERT INTO viewing_record_perk (record_id, perk_id)
VALUES (1, 1);

INSERT INTO viewing_record_perk (record_id, perk_id)
VALUES (3, 6);


