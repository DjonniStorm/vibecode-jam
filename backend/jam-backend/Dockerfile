### Stage 1: build jar с кэшированием зависимостей
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Сначала pom.xml для кэша зависимостей
COPY pom.xml .
RUN mvn -q -B -DskipTests dependency:go-offline

# Потом исходники и сборка
COPY src ./src
RUN mvn -q -B -DskipTests clean package

### Stage 2: лёгкий runtime образ
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Не запускать как root
RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=build /app/target/jam-backend-*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]


