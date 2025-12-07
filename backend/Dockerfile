FROM gradle:8.7-jdk21-alpine AS build

WORKDIR /app

COPY . .

RUN gradle clean build -x test 

# bootJar 파일 찾기 (plain JAR 제외) - 첫 번째 매칭 파일만 사용
RUN find /app/build/libs -name "*.jar" ! -name "*-plain.jar" | head -1 | xargs -I {} cp {} /app/server.jar

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=build /app/server.jar server.jar

CMD ["java", "-jar","./server.jar"]
