FROM gradle:8.7-jdk21-alpine AS build

WORKDIR /app

COPY . .

RUN gradle clean build -x test 

# bootJar 파일 찾기 및 복사 (plain JAR 제외)
RUN ls -la /app/build/libs/ && \
    for jar in /app/build/libs/*.jar; do \
      if [[ "$jar" != *"-plain.jar" ]]; then \
        echo "✅ JAR 파일 발견: $jar" && \
        cp "$jar" /app/server.jar && \
        ls -lh /app/server.jar && \
        break; \
      fi; \
    done && \
    if [ ! -f /app/server.jar ]; then \
      echo "❌ bootJar 파일을 찾을 수 없습니다." && \
      ls -la /app/build/libs/ && \
      exit 1; \
    fi

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=build /app/server.jar server.jar

CMD ["java", "-jar","./server.jar"]
