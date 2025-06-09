# EV Reservation System

<img src="https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Universiti_Teknologi_MARA_logo.svg/250px-Universiti_Teknologi_MARA_logo.svg.png" alt="UiTM Logo" width="200"/>

This project is for Operating System (CSC520) course at University Technology Mara (UiTM) Cawangan Shah Alam. It is a Spring Boot application that utilizes Java threads to manage charging sessions for electric vehicles (EVs). The application simulates a scenario where multiple EVs can reserve charging slots and manage their charging sessions concurrently.

#### Running the system

#### Prerequisites

- sdkman (recommended) (java=17.0.15-tem)

1. Install dependencies

```bash
chmod +x ./mvnw
./mvnw clean install
```

2. Run the application

```bash
./mvnw spring-boot:run
```

#### Developing the project

To start developing, you need to install nodejs version 22 and enable corepack pnpm. You will also need to have postgresql installed and running.

1. Install java dependencies

```bash
./mvnw clean install
```

2. Install node dependencies

```bash
cd static
pnpm install
```

3. Setting up database

- Create a PostgreSQL database named `ev_reservation`
- Match the credentials in `src/main/resources/application.properties` with your PostgreSQL setup

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ev_reservation
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. Open two terminals

- In the first terminal, run the Spring Boot application

```bash
./mvnw spring-boot:run
```

- In the second terminal, run the frontend development server

```bash
pnpm run dev
```

5. Access the application
   Open your web browser and navigate to `http://localhost:5173` to access the application.

6. Build frontend for production

```bash
pnpm run build
```
