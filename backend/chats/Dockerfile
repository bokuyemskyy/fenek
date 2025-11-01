FROM eclipse-temurin:25-jdk
WORKDIR /app
EXPOSE 8080
ENV SPRING_DEVTOOLS_RESTART_ENABLED=true
CMD ./gradlew build --continuous --no-daemon & ./gradlew bootRun --no-daemon


