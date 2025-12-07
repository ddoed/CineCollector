#!/bin/bash

set -e

echo "🚀 CineCollector 배포 시작..."

# 디렉토리 확인 및 생성
DEPLOY_DIR="$HOME/cinecollector"
cd "$DEPLOY_DIR"

# 환경 변수 파일 확인
if [ ! -f .env ]; then
    echo "⚠️  .env 파일이 없습니다. .env.example을 참고하여 .env 파일을 생성해주세요."
    exit 1
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

# 프로덕션 Dockerfile이 있으면 사용 (GitHub Actions에서 빌드된 파일 사용)
if [ -f backend/Dockerfile.prod ] && [ -f frontend/Dockerfile.prod ]; then
    echo "📦 프로덕션 Dockerfile 사용 (이미 빌드된 파일 사용)"
    # docker-compose.yml에서 Dockerfile 경로 변경
    sed -i 's|dockerfile: Dockerfile|dockerfile: Dockerfile.prod|g' docker-compose.yml
fi

# 이미지 빌드
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
