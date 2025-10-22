FROM eclipse-temurin:25-jdk
WORKDIR /app
COPY . .
EXPOSE 8080
ENV SPRING_DEVTOOLS_RESTART_ENABLED=true
CMD ["./gradlew", "bootRun", "--no-daemon"]
