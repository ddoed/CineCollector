FROM gradle:8.7-jdk21-alpine as build

WORKDIR /app

COPY . .

RUN gradle clean build -x test 

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# bootJar만 복사 (plain JAR 제외)
COPY --from=build /app/build/libs/*-SNAPSHOT.jar server.jar

CMD ["java", "-jar","./server.jar"]
