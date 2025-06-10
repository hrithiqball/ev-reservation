FROM eclipse-temurin:17.0.15_6-jdk

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml first for better caching
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Make maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies first (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests -B

# Use a smaller runtime image for the final stage
FROM eclipse-temurin:17.0.15_6-jre

WORKDIR /app

# Copy the jar file from the build stage
COPY --from=0 /app/target/ev-reservation-0.0.1-SNAPSHOT.jar app.jar

# Expose the port that Spring Boot runs on
EXPOSE 8080

# Set the entrypoint to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]