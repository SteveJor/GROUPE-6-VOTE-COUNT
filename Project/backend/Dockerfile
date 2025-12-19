# --- Étape 1 : Build (Compilation) ---
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /app

# Copie uniquement les fichiers de configuration pour le moment
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Donner les droits d'exécution
RUN chmod +x gradlew

# Téléchargement de Gradle et des dépendances
# Si ça échoue ici, c'est un problème de connexion internet
RUN ./gradlew --no-daemon dependencies || ./gradlew --no-daemon dependencies

# Copier le code source et compiler le JAR
COPY src src
RUN ./gradlew clean bootJar --no-daemon

# --- Étape 2 : Runtime (Exécution) ---
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Sécurité : utilisateur non-root
RUN groupadd -r spring && useradd -r -g spring spring
USER spring

# On récupère le JAR généré à l'étape 1
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]