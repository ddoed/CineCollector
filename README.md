# CineCollector

CineCollector는 영화 팬덤 문화를 기반으로 **굿즈(특전) 수집, 이벤트 참여, 관람 기록 관리**를 한 곳에서 해결하는 플랫폼입니다.  
영화관과 창작자, 수집가들이 모두 참여할 수 있는 생태계를 구축하는 것을 목표로 합니다.

---

## 서비스 개요

최근 영화 커뮤니티는 굿즈 수집, N차 관람, 한정판 이벤트 중심으로 활성화되어 있습니다.  
CineCollector는 이러한 활동을 구조적으로 기록하고 공유하는 **영화 수집 종합 플랫폼**입니다.

---

## 주요 기능

### 1. 굿즈(Perk) 관리
- 영화 이벤트에서 제공되는 **포스터, 필름마크, 아크릴 스탠드 등 특전 관리**
- 굿즈별 수량, 종류(type), 유저당 제한(limit), 재고(quantity) 등 정보 제공
- 어떤 이벤트에서 어떤 굿즈가 배포되는지 확인 가능

![굿즈 관리 화면](./docs/images/perk-management.png)

### 2. 이벤트(Event) 정보 제공
- 영화관/제작사 주최의 **주차별 굿즈 이벤트 일정 확인**
- 이벤트 기간(start/end), 배포 주차(week_no) 정보 제공
- 이벤트를 통해 Perk와 Movie를 연결
- 이벤트별 특전 신청 및 극장별 재고 확인

![이벤트 목록 화면](./docs/images/event-list.png)

### 3. 영화(Movie) 정보 관리
- 영화의 제목, 개봉일, 장르, 러닝타임 등 기본 정보 조회
- 해당 영화와 연계된 이벤트·굿즈·관람 기록과 자동 연동

![영화 정보 화면](./docs/images/movie-info.png)

### 4. 유저 수집 현황(Collection)
- 사용자가 획득한 굿즈 저장
- 획득일(obtained_date), 수량(quantity) 기록
- 개인 콜렉션 페이지에서 전체 수집 현황을 시각적으로 확인
- 영화별 특전 수집률 및 통계 제공

![특전 도감 화면](./docs/images/collection-gallery.png)

### 5. 관람 기록(ViewingRecord)
- 사용자의 **영화 관람 횟수(N차 관람)** 기록
- 관람 일자, 상영관, 리뷰 저장
- 게시 여부(is_public)를 통해 공개/비공개 설정 가능
- 관람 기록 공유 및 피드 기능

![관람 기록 화면](./docs/images/watch-history.png)

### 6. 상영관 관리(Theater)
- 상영관 정보(name, location) 관리
- 운영자의 User ID와 연계
- 극장 운영자가 직접 굿즈 재고를 업데이트할 수 있는 구조

![극장 관리 화면](./docs/images/theater-management.png)

### 7. 상영관 재고(Inventory)
- 상영관이 보유한 굿즈 재고 관리
- stock / status(available 등) 관리
- 이벤트 기간 내 실시간 재고 제공
- 극장별 재고 배포 및 관리 기능

### 8. 사용자(User)
- 일반 수집가, 상영관 운영자, 크리에이터, 관리자(Role)에 따른 기능 제공
- 이메일 로그인 기반 접근
- 역할에 따른 접근 권한 분리 가능

![사용자 프로필 화면](./docs/images/user-profile.png)

### 9. 크리에이터 대시보드
- 이벤트 생성 및 관리
- 특전 배포 및 극장별 재고 분배
- 이벤트 통계 및 분석

![크리에이터 대시보드 화면](./docs/images/creator-dashboard.png)

---

## 기술 스택

### Backend
- **Framework**: Spring Boot 3.5.7
- **Language**: Java 21
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT (JJWT 0.11.5)
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Cloud Storage**: AWS S3 (Amazon SDK 2.25.27)
- **Build Tool**: Gradle
- **ORM**: Spring Data JDBC

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animation**: Motion (Framer Motion)
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Fetch API

---

## 프로젝트 구조

```
CineCollector/
├── backend/                          # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/cinecollector/
│   │   │   │   ├── collection/      # 컬렉션 관리
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── entity/
│   │   │   │   │   ├── repository/
│   │   │   │   │   └── service/
│   │   │   │   ├── common/          # 공통 모듈
│   │   │   │   │   ├── config/      # 설정 (CORS, Security, S3, Swagger)
│   │   │   │   │   ├── exception/   # 예외 처리
│   │   │   │   │   ├── jwt/         # JWT 인증
│   │   │   │   │   ├── response/    # API 응답 형식
│   │   │   │   │   ├── s3/          # AWS S3 연동
│   │   │   │   │   └── security/    # 보안 설정
│   │   │   │   ├── event/           # 이벤트 관리
│   │   │   │   ├── inventory/       # 재고 관리
│   │   │   │   ├── movie/           # 영화 정보
│   │   │   │   ├── perk/           # 특전 관리
│   │   │   │   ├── perkapplication/ # 특전 신청
│   │   │   │   ├── theater/        # 극장 관리
│   │   │   │   ├── user/           # 사용자 관리
│   │   │   │   └── viewingrecord/  # 관람 기록
│   │   │   └── resources/
│   │   │       ├── application.yaml # 설정 파일
│   │   │       ├── schema.sql      # 데이터베이스 스키마
│   │   │       └── data.sql        # 초기 데이터
│   │   └── test/
│   ├── build.gradle                  # Gradle 의존성 관리
│   └── gradlew                       # Gradle Wrapper
│
├── frontend/                         # React 프론트엔드
│   ├── src/
│   │   ├── components/              # React 컴포넌트
│   │   │   ├── CollectionGallery.tsx    # 특전 도감
│   │   │   ├── CreatorDashboard.tsx     # 크리에이터 대시보드
│   │   │   ├── EventsPerks.tsx          # 이벤트·특전 목록
│   │   │   ├── Feed.tsx                 # 홈 피드
│   │   │   ├── Landing.tsx               # 랜딩 페이지
│   │   │   ├── TheaterManagement.tsx    # 극장 관리
│   │   │   ├── UserProfile.tsx          # 사용자 프로필
│   │   │   ├── WatchHistory.tsx          # 관람 기록
│   │   │   ├── StockDistributionDialog.tsx # 재고 배포 다이얼로그
│   │   │   └── ui/                   # UI 컴포넌트 (Radix UI)
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # 인증 컨텍스트
│   │   ├── hooks/
│   │   │   └── useAuth.ts           # 인증 훅
│   │   ├── lib/
│   │   │   └── api.ts               # API 클라이언트
│   │   ├── App.tsx                   # 메인 앱 컴포넌트
│   │   └── main.tsx                  # 진입점
│   ├── package.json                  # npm 의존성 관리
│   ├── vite.config.ts                # Vite 설정
│   └── index.html                    # HTML 템플릿
│
└── README.md                         # 프로젝트 문서
```

---

## 개발 환경 설정

### 사전 요구사항
- Java 21 이상
- Node.js 18 이상
- PostgreSQL 12 이상
- Gradle 8.0 이상 (또는 Gradle Wrapper 사용)

### Backend 설정

1. **데이터베이스 생성**
```sql
CREATE DATABASE cinecollector;
```

2. **환경 변수 설정**
백엔드 루트 디렉토리에 `.env` 파일 생성 (또는 시스템 환경 변수 설정):
```env
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
BUCKET_NAME=your_s3_bucket_name
BUCKET_REGION=your_s3_region
JWT_ACCESS_EXPIRE=3600000
JWT_REFRESH_EXPIRE=1209600000
```

3. **백엔드 실행**
```bash
cd backend
./gradlew bootRun
# 또는 Windows의 경우
gradlew.bat bootRun
```

백엔드는 `http://localhost:8080`에서 실행됩니다.

4. **API 문서 확인**
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend 설정

1. **의존성 설치**
```bash
cd frontend
npm install
```

2. **환경 변수 설정 (선택사항)**
프론트엔드 루트 디렉토리에 `.env` 파일 생성:
```env
VITE_API_BASE_URL=http://localhost:8080
```

3. **프론트엔드 실행**
```bash
npm run dev
```

프론트엔드는 `http://localhost:5173` (또는 `http://localhost:3000`)에서 실행됩니다.

4. **프로덕션 빌드**
```bash
npm run build
```

---

## 데이터베이스 스키마

주요 테이블:
- `users` - 사용자 정보
- `movies` - 영화 정보
- `events` - 이벤트 정보
- `perks` - 특전 정보
- `theaters` - 극장 정보
- `inventories` - 극장별 재고
- `collections` - 사용자 수집 현황
- `viewing_records` - 관람 기록
- `viewingrecord_image` - 관람 기록 이미지
- `viewing_record_perk` - 관람 기록별 특전
- `perk_applications` - 특전 신청 내역

자세한 스키마는 `backend/src/main/resources/schema.sql` 참조

---

## API 엔드포인트

### 인증
- `POST /users/login` - 로그인
- `POST /users/signup` - 회원가입
- `GET /users/me` - 현재 사용자 정보
- `PATCH /users/me` - 프로필 수정

### 이벤트
- `GET /events/list` - 이벤트 목록 조회
- `GET /events/{eventId}/detail` - 이벤트 상세 조회
- `POST /events/with-perk` - 이벤트 생성 (특전 포함)
- `DELETE /events/{eventId}` - 이벤트 삭제

### 특전
- `GET /perks/events/{eventId}` - 이벤트별 특전 조회

### 컬렉션
- `GET /collections` - 내 컬렉션 조회
- `POST /collections` - 컬렉션 추가
- `PATCH /collections/{perkId}` - 컬렉션 수정
- `DELETE /collections/{perkId}` - 컬렉션 삭제

### 관람 기록
- `GET /viewing-records/my` - 내 관람 기록 조회
- `GET /viewing-records/home` - 홈 피드 조회
- `POST /viewing-records` - 관람 기록 생성
- `DELETE /viewing-records/{recordId}` - 관람 기록 삭제

### 극장 관리
- `GET /theaters` - 극장 목록 조회
- `GET /theaters/my` - 내 극장 정보

### 재고 관리
- `GET /inventory/list` - 재고 목록 조회
- `GET /inventory/statistics` - 재고 통계
- `PATCH /inventory/{perkId}/{theaterId}` - 재고 수정
- `POST /inventory/{perkId}/distribute` - 재고 배포

자세한 API 문서는 Swagger UI에서 확인 가능합니다.

---

## 개발 버전 관리

### Git Workflow
- `main` - 프로덕션 브랜치
- `develop` - 개발 브랜치
- `feature/*` - 기능 개발 브랜치
- `fix/*` - 버그 수정 브랜치

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 설정 등
```

---

## 라이선스

이 프로젝트는 데이터베이스 프로그래밍 프로젝트입니다.

---

## 개발자

- **임나빈** (202455374)
- 정보컴퓨터공학부 컴퓨터공학전공

---

## 참고사항

- 백엔드와 프론트엔드는 별도로 실행해야 합니다.
- CORS 설정은 개발 환경(`http://localhost:3000`, `http://localhost:5173`)에 맞춰져 있습니다.
- 프로덕션 배포 시 환경 변수 및 보안 설정을 재확인하세요.
