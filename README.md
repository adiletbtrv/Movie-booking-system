<div align="center">

# 🎬 Cinema Enterprise Booking System

**An enterprise-grade, full-stack hybrid cinema management and seat reservation platform featuring Spring Boot 3, PostgreSQL, Flyway, stateless JWT security, React 19, and a native JavaFX 17 desktop kiosk bridge.**

[![Java](https://img.shields.io/badge/Java-17%20LTS-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Flyway](https://img.shields.io/badge/Flyway-Migration-CC0200?style=flat-square&logo=flyway&logoColor=white)](https://flywaydb.org/)
[![JavaFX](https://img.shields.io/badge/JavaFX-17.0.8-FF6600?style=flat-square&logo=java&logoColor=white)](https://openjfx.io/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<br/>

**[Preview & UI](#-preview--user-interface)** • **[Key Highlights](#-key-architectural--engineering-highlights)** • **[System Architecture](#-system-architecture)** • **[Tech Stack](#-tech-stack)** • **[Project Structure](#-project-structure)** • **[API Specification](#-rest-api-specification)** • **[Getting Started](#-getting-started)** • **[Testing & QA](#-testing--quality-assurance)** • **[License & Author](#-license--author)**

</div>

---

## 📸 Preview & User Interface

<div align="center">
  <img width="100%" alt="Cinema Catalog and Movie Details" src="https://github.com/user-attachments/assets/0bb4af7d-6827-4db1-b927-9c424e60365e" />
  <p><em>Interactive movie catalog with dynamic search, rating filters, and showtime schedule browser.</em></p>
</div>

<br/>

<div align="center">
  <img width="100%" alt="Interactive Seat Booking Map" src="https://github.com/user-attachments/assets/d0d63fbd-2c26-474c-98b8-e0842148c7c8" />
  <p><em>Real-time seat reservation matrix featuring VIP row pricing, multi-seat selection, and countdown hold timer.</em></p>
</div>

<br/>

<div align="center">
  <img width="100%" alt="Admin Intelligence & Management Dashboard" src="https://github.com/user-attachments/assets/5474b1d8-a8b7-483e-9a2a-d76fcfa82649" />
  <p><em>Executive analytics dashboard, automated TMDB API movie ingestion pipeline, and screening session management.</em></p>
</div>

---

## ⚡ Key Architectural & Engineering Highlights

- **Hybrid Web-to-Desktop IPC Bridge (`movie-booking/desktop-client/src/main/java/com/cinema/client/CinemaApplication.java`):**
  Constructed a high-throughput hybrid kiosk runtime utilizing JavaFX `WebView` and `WebEngine` backed by `netscape.javascript.JSObject` bidirectional bindings. The application injects a custom `JavaConsoleBridge` directly into the DOM window context (`window.javaConsole`), proxying React runtime lifecycle logs and uncaught UI exceptions to the JVM `System.out` / `System.err` streams without overhead.

- **Stateless RBAC Security Filter Pipeline (`movie-booking/movie-service/src/main/java/com/cinema/movie/security/JwtAuthenticationFilter.java`):**
  Implemented a zero-session, stateless Spring Security 6 architecture powered by HMAC-SHA256 JWT claim verification and BCrypt salted cryptographic password hashing (`SecurityConfig.java`). Strict Role-Based Access Control (`ROLE_ADMIN` vs `ROLE_USER`) is enforced across administrative routes (`/admin/**`) and operational endpoints with `@EnableMethodSecurity`.

- **Transactional Seat Allocation & Dynamic Pricing Matrix (`cinema-enterprise-booking/views/Booking.tsx` & `movie-booking/movie-service/src/main/java/com/cinema/movie/service/BookingService.java`):**
  Engineered a 2D cinema hall projection ($R \times C$) with an optimistic 5-minute client-side reservation hold timer ($t_{\text{hold}} = 300\,\text{s}$). Concurrency safety and race condition elimination are guaranteed at the persistence tier via composite database unique constraints `UNIQUE(screening_id, row_index, seat_index)`. Pricing is dynamically computed via seat category modifiers:
  $$\text{Price}_{\text{total}} = \sum_{s \in S_{\text{selected}}} \left( \text{Price}_{\text{screening}} \times \mu_{\text{tier}}(s) \right), \quad \text{where } \mu_{\text{VIP}} = 1.5, \; \mu_{\text{Standard}} = 1.0$$

- **Automated External ETL Ingestion Engine (`movie-booking/movie-service/src/main/java/com/cinema/movie/service/TmdbService.java`):**
  Built an automated movie catalog ingestion pipeline leveraging Spring Boot 3.2's fluent `RestClient`. Queries the TMDB v3 API with aggregated sub-resource requests (`append_to_response=credits,videos,release_dates`) to perform relational normalization across `movies`, `genres`, `actors`, and `movie_actors` join tables in an idempotent transactional execution.

- **Evolutionary Database Versioning (`movie-booking/movie-service/src/main/resources/db/migration`):**
  Maintained zero-downtime, fully reproducible relational schemas utilizing Flyway database migrations (`V1__init_movies.sql`, `V2__booking_entities.sql`, `V3__security_entities.sql`) for PostgreSQL 15, eliminating ORM schema drift.

---

## 🏛 System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT TIERS                                         │
│                                                                                        │
│   ┌────────────────────────────────────────┐    ┌──────────────────────────────────┐   │
│   │           Web Browser SPA              │    │     JavaFX Desktop Kiosk         │   │
│   │    (React 19 / Vite / TailwindCSS)     │    │  (Embedded WebView + JS Bridge)  │   │
│   └───────────────────┬────────────────────┘    └────────────────┬─────────────────┘   │
└───────────────────────┼──────────────────────────────────────────┼─────────────────────┘
                        │ HTTP / JSON REST API                     │
                        ▼                                          ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SPRING BOOT 3 ENTERPRISE BACKEND                                │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                         Security & Gateway Layer                               │   │
│   │           JwtAuthenticationFilter ◄──► SecurityConfig (Stateless RBAC)         │   │
│   └───────────────────────────────────────┬────────────────────────────────────────┘   │
│                                           │                                            │
│   ┌───────────────────────────────────────▼────────────────────────────────────────┐   │
│   │                            REST Controllers Layer                              │   │
│   │    AuthController │ MovieController │ BookingController │ AdminController     │   │
│   └───────────────────────────────────────┬────────────────────────────────────────┘   │
│                                           │                                            │
│   ┌───────────────────────────────────────▼────────────────────────────────────────┐   │
│   │                             Service Business Layer                             │   │
│   │    AuthService    │ MovieService    │ BookingService    │ AdminService        │   │
│   │                   │                 │                   │ TmdbService          │   │
│   └───────────────────┼─────────────────┼───────────────────┼──────────┬───────────┘   │
│                       │                 │                   │          │               │
│   ┌───────────────────▼─────────────────▼───────────────────▼──────┐   │ External Call │
│   │             Spring Data JPA & Hibernate 6 Repositories         │   │ (HTTP REST)   │
│   │      UserRepository │ MovieRepository │ TicketRepository       │   ▼               │
│   │      ScreeningRepository │ HallRepository │ ActorRepository    │ ┌───────────────┐ │
│   └───────────────────────────────────┬────────────────────────────┘ │  The Movie DB │ │
│                                       │                              │  (TMDB API v3)│ │
│                                       │ SQL / Connection Pool        └───────────────┘ │
└───────────────────────────────────────┼────────────────────────────────────────────────┘
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               STORAGE & PERSISTENCE TIER                               │
│                                                                                        │
│   ┌────────────────────────────────────────────────┐   ┌───────────────────────────┐   │
│   │                 PostgreSQL 15                  │   │          Redis 7          │   │
│   │  (Schema Versioned by Flyway: V1, V2, V3)      │   │  (Cache & Session Store)  │   │
│   └────────────────────────────────────────────────┘   └───────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Core Technologies & Frameworks

| Layer / Domain | Technologies / Version | Description / Purpose |
| :--- | :--- | :--- |
| **Frontend Web SPA** | `React 19.2.0`<br/>`TypeScript 5.8.2`<br/>`Vite 6.2.0` | High-performance single-page cinema booking client with StrictMode rendering. |
| **Routing & State** | `React Router DOM 7.9.6`<br/>`Lucide React 0.555.0` | Client-side declarative routing, guard redirect strategies, and iconography. |
| **Styling & Theme** | `Tailwind CSS 3.x`<br/>`CSS3 Custom Properties` | Custom dark-mode cinema aesthetic (`#0f172a`, `#1e293b`, `#e11d48` accent, `#f59e0b` gold). |
| **Desktop Kiosk Client** | `JavaFX 17.0.8`<br/>`Java 17 LTS` | Standalone terminal client embedding `WebView` with custom Java-to-JavaScript IPC bridges. |
| **Backend Framework** | `Spring Boot 3.2.1`<br/>`Spring Framework 6` | Core microservice engine providing DI, MVC controllers, validation, and REST services. |
| **Security & Cryptography** | `Spring Security 6`<br/>`io.jsonwebtoken 0.11.5` | Stateless authentication, BCrypt password hashing, and HMAC-SHA256 JWT filter. |
| **ORM & Data Access** | `Spring Data JPA`<br/>`Hibernate ORM 6.x` | Declarative repositories, transactional boundary management, and JPQL querying. |
| **Database & Migrations** | `PostgreSQL 15`<br/>`Flyway Core 10.x` | Production relational store with strictly versioned incremental SQL schema migrations. |
| **Caching & Infrastructure**| `Redis 7`<br/>`Docker & Docker Compose` | Distributed containerized database and caching services. |
| **External Integration** | `TMDB API v3`<br/>`Spring RestClient` | Automated movie metadata, poster graphics, cast lists, and YouTube trailer extraction. |
| **Build & Tooling** | `Apache Maven 3.9+`<br/>`Node.js 18+` | Polyglot multi-module build systems and dependency managers. |

---

## 📁 Project Structure

```
Movie-booking-system/
├── cinema-enterprise-booking/                # Frontend React SPA application
│   ├── public/
│   │   └── favicon.svg                       # Application vector icon
│   ├── services/
│   │   └── api.ts                            # Axios/Fetch wrapper with JWT injection & 401 interceptor
│   ├── views/
│   │   ├── AdminDashboard.tsx                # TMDB importer, revenue metrics, hall & session manager
│   │   ├── Booking.tsx                       # Interactive seat map, dynamic pricing & countdown timer
│   │   ├── Catalog.tsx                       # Movie grid browser with search & genre filtering
│   │   ├── Login.tsx                         # Authentication view with credential submission
│   │   ├── MovieDetails.tsx                  # Detailed synopsis, cast list & showtime selection
│   │   └── MyTickets.tsx                     # User ticket ledger with dynamic QR-code badges
│   ├── App.tsx                               # Root layout, role-based navigation & HashRouter configuration
│   ├── index.html                            # HTML entrypoint with Tailwind CDN & module map
│   ├── index.tsx                             # React 19 root mounting point
│   ├── package.json                          # Frontend dependencies & npm run scripts
│   ├── tsconfig.json                         # TypeScript compiler configuration
│   ├── types.ts                              # Domain interfaces (Movie, Screening, Seat, Ticket, User, Role)
│   └── vite.config.ts                        # Vite bundler plugins and dev server settings
│
├── movie-booking/                            # Multi-module Maven backend & desktop solution
│   ├── desktop-client/                       # JavaFX Native Kiosk terminal module
│   │   ├── src/main/java/com/cinema/client/
│   │   │   └── CinemaApplication.java        # JavaFX WebView loader with JavaConsoleBridge IPC
│   │   └── pom.xml                           # JavaFX 17 controls, web, fxml & javafx-maven-plugin
│   │
│   ├── movie-service/                        # Spring Boot 3 Core REST microservice
│   │   ├── src/main/java/com/cinema/movie/
│   │   │   ├── config/
│   │   │   │   ├── ApplicationConfig.java    # AuthenticationManager & PasswordEncoder beans
│   │   │   │   ├── DataInitializer.java      # CommandLineRunner for initial seed users & halls
│   │   │   │   └── SecurityConfig.java       # SecurityFilterChain, CSRF disable & route rules
│   │   │   ├── controller/
│   │   │   │   ├── AdminController.java      # Endpoints for stats, screening CRUD & hall queries
│   │   │   │   ├── AuthController.java       # User registration and JWT login endpoints
│   │   │   │   ├── BookingController.java    # Seat reservation, taken seats & user booking ledger
│   │   │   │   ├── MovieController.java      # Public catalog and movie lookup endpoints
│   │   │   │   └── MovieImportController.java# TMDB automated movie import endpoint
│   │   │   ├── domain/                       # JPA Entities: Movie, Actor, Genre, Hall, Screening, Ticket, User
│   │   │   ├── dto/                          # Data Transfer Objects & request payloads
│   │   │   ├── repository/                   # Spring Data JPA interfaces
│   │   │   ├── security/
│   │   │   │   ├── JwtAuthenticationFilter.java # OncePerRequestFilter for Bearer token resolution
│   │   │   │   └── JwtService.java           # JWT generator, parser & claims validator
│   │   │   ├── service/
│   │   │   │   ├── AdminService.java         # Revenue calculations, capacity aggregation & cascading deletes
│   │   │   │   ├── AuthService.java          # User persistence & authentication token issuance
│   │   │   │   ├── BookingService.java       # Transactional seat validation & ticket issuance
│   │   │   │   ├── MovieService.java         # Movie catalog management with DTO mapping
│   │   │   │   └── TmdbService.java          # External TMDB REST API client & entity hydrator
│   │   │   └── MovieServiceApplication.java  # Spring Boot application main entry point
│   │   ├── src/main/resources/
│   │   │   ├── db/migration/
│   │   │   │   ├── V1__init_movies.sql       # Movies, genres, actors & relational mapping tables
│   │   │   │   ├── V2__booking_entities.sql  # Halls, screenings, tickets & seat uniqueness constraints
│   │   │   │   └── V3__security_entities.sql # Users table & foreign key relationships
│   │   │   └── application.yml               # Service port, JDBC datasource, Flyway & TMDB configs
│   │   ├── src/test/java/com/cinema/movie/
│   │   │   └── service/MovieServiceTest.java # JUnit 5 + Mockito unit test suite
│   │   └── pom.xml                           # Spring Boot starter dependencies & plugins
│   │
│   ├── docker-compose.yml                    # PostgreSQL 15 & Redis 7 container orchestration
│   └── pom.xml                               # Root parent POM with dependency management
│
├── .gitignore                                # Git ignore patterns for OS, IDE & build artifacts
└── README.md                                 # Technical architecture & project documentation
```

---

## 🌐 REST API Specification

All backend endpoints run under `http://localhost:8081`. Protected routes require an `Authorization: Bearer <token>` header.

### 🔐 Authentication (`/auth`)

| Method | Endpoint | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | `{ username, password, email }` | Registers a new user account with `ROLE_USER`. |
| `POST` | `/auth/login` | Public | `{ username, password }` | Authenticates credentials and returns a signed JWT. |

### 🎬 Movie Catalog (`/movies`)

| Method | Endpoint | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/movies` | Authenticated | *None* | Retrieves the full active movie catalog. |
| `GET` | `/movies/{id}` | Authenticated | *None* | Retrieves detailed metadata for a specific movie. |
| `POST` | `/movies` | `ROLE_ADMIN` | `MovieDto` | Manually creates and registers a new movie. |

### 🎟 Screenings & Bookings (`/screenings`, `/bookings`)

| Method | Endpoint | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/screenings?movieId={id}` | Authenticated | *None* | Retrieves upcoming screening sessions for a movie. |
| `GET` | `/screenings/{id}/seats` | Authenticated | *None* | Lists all reserved seat indices for a screening. |
| `POST` | `/bookings` | Authenticated | `{ screeningId, rowIndex, seatIndex }` | Transactionally reserves an individual seat. |
| `GET` | `/bookings/my` | Authenticated | *None* | Returns all booked tickets for the current authenticated user. |

### ⚡ Administration (`/admin`)

| Method | Endpoint | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/admin/stats` | `ROLE_ADMIN` | *None* | Computes total revenue, tickets sold, and active movie counts. |
| `GET` | `/admin/halls` | `ROLE_ADMIN` | *None* | Lists all physical cinema halls and dimension configs. |
| `POST` | `/admin/screenings` | `ROLE_ADMIN` | `{ movieId, hallId, startTime, price }` | Schedules a new screening session in a hall. |
| `DELETE` | `/admin/screenings/{id}` | `ROLE_ADMIN` | *None* | Deletes a screening session and all associated tickets. |
| `DELETE` | `/admin/movies/{id}` | `ROLE_ADMIN` | *None* | Cascading deletion of a movie and its screenings. |
| `POST` | `/admin/movies/import/tmdb/{tmdbId}` | `ROLE_ADMIN` | *None* | Fetches and persists movie metadata from TMDB v3 API. |

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure your development environment has the following tools installed:

- **Java Development Kit (JDK):** Version 17 LTS or higher
- **Node.js & npm:** Node.js 18.x+ / npm 9.x+
- **Docker & Docker Compose:** Docker Engine 24.x+ / Compose v2+
- **Apache Maven:** Version 3.8+ (or use wrapper)

---

### 1️⃣ Spin Up Infrastructure (PostgreSQL & Redis)

Start the containerized PostgreSQL 15 and Redis 7 instances:

```bash
cd movie-booking
docker compose up -d
```

> **Database Configuration:** PostgreSQL is exposed on port `5433` (mapped from `5432` internally) with credentials `postgres` / `password` and database `cinema_db`.

---

### 2️⃣ Start the Spring Boot Backend Service

Launch the backend service; Flyway will automatically execute migrations and `DataInitializer` will seed default accounts:

```bash
cd movie-booking/movie-service
mvn spring-boot:run
```

*The server will be operational at `http://localhost:8081`.*

#### 🔑 Seed Credentials:
| Username | Password | Assigned Role | Permissions |
| :--- | :--- | :--- | :--- |
| `admin` | `admin` | `ROLE_ADMIN` | Full access: stats, TMDB import, screenings CRUD |
| `user` | `user` | `ROLE_USER` | Catalog browsing, seat reservation, my tickets |

---

### 3️⃣ Launch the React Web Frontend

Install dependencies and start the Vite development server:

```bash
cd cinema-enterprise-booking
npm install
npm run dev
```

*Open your browser and navigate to `http://localhost:5173`.*

---

### 4️⃣ (Optional) Run the JavaFX Desktop Kiosk Client

To run the native desktop terminal client with the embedded React application:

```bash
cd movie-booking/desktop-client
mvn clean package
mvn javafx:run
```

---

## 🧪 Testing & Quality Assurance

### Backend Automated Unit Tests

The backend test suite verifies core business logic, repository interactions, and exception handling using **JUnit 5** and **Mockito**:

```bash
cd movie-booking/movie-service
mvn test
```

### Static Analysis & Type Verification

Verify TypeScript compilation, strict type safety, and production build readiness:

```bash
cd cinema-enterprise-booking
npx tsc --noEmit
npm run build
```

---

## 📜 License & Author

Distributed under the **MIT License**. See `LICENSE` for more information.

**Author:** [Adilet Batyrov](https://github.com/adiletbtrv) • Connect on [LinkedIn](https://www.linkedin.com/in/adilet-batyrov/)
