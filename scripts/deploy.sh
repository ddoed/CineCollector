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

# Docker 설치 확인
if ! command -v docker &> /dev/null; then
    echo "📦 Docker 설치 중..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker 설치 완료"
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
    echo "✅ PostgreSQL 설치 완료"
fi

# Nginx 설치 확인 (Frontend용)
if ! command -v nginx &> /dev/null; then
    echo "📦 Nginx 설치 중..."
    sudo apt-get update
    sudo apt-get install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo "✅ Nginx 설치 완료"
fi

# Node.js 설치 확인 (Frontend 빌드용)
if ! command -v node &> /dev/null; then
    echo "📦 Node.js 설치 중..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js 설치 완료"
fi

# ========== Backend 배포 ==========
echo ""
echo "🔨 Backend 배포 시작..."

cd backend

# Docker 이미지 빌드
echo "📦 Backend Docker 이미지 빌드 중..."
docker build -t cinecollector-backend .

# 기존 컨테이너 중지 및 제거
echo "🛑 기존 Backend 컨테이너 중지 중..."
docker stop cinecollector-backend 2>/dev/null || true
docker rm cinecollector-backend 2>/dev/null || true

# 새 컨테이너 실행
echo "▶️  Backend 컨테이너 시작 중..."
docker run --rm -d -p 8080:8080 \
    --env-file ../.env \
    --name cinecollector-backend \
    --add-host=host.docker.internal:host-gateway \
    cinecollector-backend

echo "✅ Backend 배포 완료!"

cd ..

# ========== Frontend 배포 ==========
echo ""
echo "🔨 Frontend 배포 시작..."

cd frontend

# Frontend 빌드
if [ -f "package.json" ]; then
    echo "📦 Frontend 의존성 설치 중..."
    npm ci
    
    echo "🔨 Frontend 빌드 실행 중..."
    npm run build
    
    # 빌드 디렉토리 확인
    if [ ! -d "build" ]; then
        echo "❌ Frontend 빌드 디렉토리(build)가 생성되지 않았습니다."
        exit 1
    fi
    echo "✅ Frontend 빌드 완료: $(du -sh build | cut -f1)"
else
    echo "⚠️  frontend/package.json 파일을 찾을 수 없습니다."
    exit 1
fi

# Nginx 설정 파일 생성
echo "📝 Nginx 설정 파일 생성 중..."
sudo tee /etc/nginx/sites-available/cinecollector > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    root $DEPLOY_DIR/frontend/build;
    index index.html;

    # Gzip 압축 설정
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # 정적 파일 캐싱
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 라우팅을 위한 설정
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API 프록시 설정
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Nginx 사이트 활성화
sudo ln -sf /etc/nginx/sites-available/cinecollector /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Nginx 설정 테스트 및 재시작
echo "🔄 Nginx 재시작 중..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Frontend 배포 완료!"

cd ..

# 헬스 체크
echo ""
echo "🏥 헬스 체크 중..."
sleep 10

# Backend 헬스 체크
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1 || curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Backend가 정상적으로 실행 중입니다."
else
    echo "⚠️  Backend 헬스 체크 실패. 로그를 확인해주세요."
    docker logs cinecollector-backend
fi

# Frontend 헬스 체크
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Frontend가 정상적으로 실행 중입니다."
else
    echo "⚠️  Frontend 헬스 체크 실패. Nginx 로그를 확인해주세요."
    sudo tail -n 20 /var/log/nginx/error.log
fi

echo ""
echo "✅ 배포 완료!"
echo ""
echo "📊 실행 상태:"
docker ps | grep cinecollector-backend || echo "Backend 컨테이너를 찾을 수 없습니다."
sudo systemctl status nginx --no-pager -l | head -n 5

echo ""
echo "🌐 접속 정보:"
EC2_HOST=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "YOUR_EC2_IP")
echo "   Frontend: http://$EC2_HOST"
echo "   Backend API: http://$EC2_HOST:8080"
echo "   Swagger UI: http://$EC2_HOST:8080/swagger-ui.html"
