#!/bin/bash

set -e

echo "🚀 CineCollector 배포 시작..."

# 디렉토리 확인 및 생성
DEPLOY_DIR="$HOME/cinecollector"
cd "$DEPLOY_DIR"

# 환경 변수 파일 확인
if [ ! -f .env ]; then
    echo "⚠️  .env 파일이 없습니다."
    
    # 백업에서 .env 파일 복원 시도
    if [ -f ../cinecollector_backup/.env ]; then
        echo "📋 백업에서 .env 파일 복원 중..."
        cp ../cinecollector_backup/.env .env
        echo "✅ .env 파일 복원 완료"
    elif [ -f .env.example ]; then
        echo "📋 .env.example을 기반으로 .env 파일을 생성합니다."
        echo "⚠️  실제 값으로 수정이 필요합니다!"
        cp .env.example .env
        echo "✅ .env 파일 생성 완료 (값 수정 필요)"
        echo ""
        echo "⚠️  중요: .env 파일을 실제 값으로 수정한 후 다시 배포하세요."
        echo "   nano .env"
        exit 1
    else
        echo "❌ .env 파일이 없고 백업도 없습니다."
        echo ""
        echo "다음 명령으로 .env 파일을 생성하세요:"
        echo "  nano .env"
        echo ""
        echo "필수 환경 변수:"
        echo "  - DB_URL, DB_USERNAME, DB_PASSWORD"
        echo "  - JWT_SECRET"
        echo "  - AWS_ACCESS_KEY, AWS_SECRET_KEY, BUCKET_NAME, BUCKET_REGION"
        exit 1
    fi
fi

# Docker 및 Docker Compose 설치 확인
if ! command -v docker &> /dev/null; then
    echo "📦 Docker 설치 중..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo "📦 Docker Compose 설치 중..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# PostgreSQL 설치 확인 및 설정
if ! command -v psql &> /dev/null; then
    echo "📦 PostgreSQL 설치 중..."
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
    
    # PostgreSQL 서비스 시작
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # 데이터베이스 생성 (필요한 경우)
    sudo -u postgres psql -c "CREATE DATABASE cinecollector;" || echo "데이터베이스가 이미 존재합니다."
fi

# 기존 컨테이너 중지 및 제거
echo "🛑 기존 컨테이너 중지 중..."
if [ -f docker-compose.yml ]; then
    docker-compose down || true
else
    echo "⚠️  docker-compose.yml 파일을 찾을 수 없습니다."
    exit 1
fi

# Frontend 빌드 (EC2에서 직접 빌드)
if [ -d "frontend" ]; then
    echo "🔨 Frontend 빌드 중..."
    cd frontend
    if [ -f "package.json" ]; then
        # Node.js 설치 확인
        if ! command -v node &> /dev/null; then
            echo "📦 Node.js 설치 중..."
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        fi
        
        # 의존성 설치
        echo "📦 Frontend 의존성 설치 중..."
        npm ci
        
        # 빌드 실행
        echo "🔨 Frontend 빌드 실행 중..."
        npm run build
        
        # 빌드 디렉토리 확인
        if [ ! -d "build" ]; then
            echo "❌ Frontend 빌드 디렉토리(build)가 생성되지 않았습니다."
            echo "빌드 로그를 확인하세요."
            exit 1
        fi
        echo "✅ Frontend 빌드 완료: $(du -sh build | cut -f1)"
    else
        echo "⚠️  frontend/package.json 파일을 찾을 수 없습니다."
    fi
    cd ..
else
    echo "⚠️  frontend 디렉토리를 찾을 수 없습니다."
fi

# Backend 빌드 (EC2에서 직접 빌드)
if [ -d "backend" ]; then
    echo "🔨 Backend 빌드 중..."
    cd backend
    if [ -f "build.gradle" ]; then
        # Java 설치 확인
        if ! command -v java &> /dev/null; then
            echo "📦 Java 21 설치 중..."
            sudo apt-get update
            sudo apt-get install -y openjdk-21-jdk
        fi
        
        # Gradle 빌드 실행
        chmod +x ./gradlew
        ./gradlew build -x test
        
        # 빌드된 JAR 파일 확인
        if [ ! -f "build/libs/"*.jar ]; then
            echo "❌ Backend JAR 파일이 생성되지 않았습니다."
            echo "빌드 로그를 확인하세요."
            exit 1
        fi
        echo "✅ Backend 빌드 완료: $(ls -lh build/libs/*.jar | awk '{print $5}')"
    else
        echo "⚠️  backend/build.gradle 파일을 찾을 수 없습니다."
    fi
    cd ..
else
    echo "⚠️  backend 디렉토리를 찾을 수 없습니다."
fi

# 프로덕션 Dockerfile이 있으면 사용 (빌드된 파일 사용)
if [ -f backend/Dockerfile.prod ] && [ -f frontend/Dockerfile.prod ]; then
    echo "📦 프로덕션 Dockerfile 사용 (이미 빌드된 파일 사용)"
    # docker-compose.yml에서 Dockerfile 경로 변경
    sed -i 's|dockerfile: Dockerfile|dockerfile: Dockerfile.prod|g' docker-compose.yml
fi

# Docker 이미지 빌드
echo "🔨 Docker 이미지 빌드 중..."
docker-compose build --no-cache

# 컨테이너 시작
echo "▶️  컨테이너 시작 중..."
docker-compose up -d

# 헬스 체크
echo "🏥 헬스 체크 중..."
sleep 10

# Backend 헬스 체크
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1 || curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Backend가 정상적으로 실행 중입니다."
else
    echo "⚠️  Backend 헬스 체크 실패. 로그를 확인해주세요."
    docker-compose logs backend
fi

# Frontend 헬스 체크
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Frontend가 정상적으로 실행 중입니다."
else
    echo "⚠️  Frontend 헬스 체크 실패. 로그를 확인해주세요."
    docker-compose logs frontend
fi

echo "✅ 배포 완료!"
echo "📊 컨테이너 상태:"
docker-compose ps

echo ""
echo "🌐 접속 정보:"
EC2_HOST=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "YOUR_EC2_IP")
echo "   Frontend: http://$EC2_HOST"
echo "   Backend API: http://$EC2_HOST:8080"
echo "   Swagger UI: http://$EC2_HOST:8080/swagger-ui.html"
