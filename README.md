# Movie Booking System

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **A Full-Stack Cinema Booking Application** built with a Microservice-ready Backend, a modern React Frontend, and a Java Swing Desktop Client wrapper.

## Screenshots

<img width="2560" height="1080" alt="image" src="https://github.com/user-attachments/assets/0bb4af7d-6827-4db1-b927-9c424e60365e" />

<img width="2560" height="1080" alt="image" src="https://github.com/user-attachments/assets/d0d63fbd-2c26-474c-98b8-e0842148c7c8" />

<img width="2560" height="1080" alt="image" src="https://github.com/user-attachments/assets/5474b1d8-a8b7-483e-9a2a-d76fcfa82649" />

<img width="2560" height="1080" alt="image" src="https://github.com/user-attachments/assets/0e25b619-acb9-42c6-9511-7d7ec9b67915" />

<img width="2560" height="1080" alt="image" src="https://github.com/user-attachments/assets/93f58177-e6de-409d-bd68-f8d739f087f5" />

<img width="2560" height="1080" alt="image" src="https://github.com/user-attachments/assets/4ee9ce8c-340b-44f9-98fb-b72d220fb1c9" />

<img width="2560" height="1080" alt="image" src="https://github.com/user-attachments/assets/43ff41d4-1f7d-4f7f-a4c7-629318852414" />

<img width="2560" height="1080" alt="image" src="https://github.com/user-attachments/assets/9b9cb62f-25d8-4949-b8a9-313bd1a98f42" />

---

## Table of Contents
1. [Project Overview](#-project-overview)
2. [Functionalities](#-functionalities)
3. [Tech Stack](#-tech-stack)
4. [Algorithms & Data Structures](#-algorithms--data-structures)
5. [File Handling & Database](#-file-handling--database)
6. [Setup & Installation](#-setup--installation)
7. [Video Demo](#-video-demo)

---

## Project Overview
Cinema Enterprise Booking is a comprehensive solution for managing movie theater operations. It bridges the gap between web-based user convenience and desktop-based administration.

**Key Highlights:**
* **Hybrid Platform:** Accessible via Web Browser and Native Desktop Application.
* **Security:** Robust authentication using JWT (JSON Web Tokens) and BCrypt hashing.
* **Real-time Updates:** Instant seat availability checks and booking management.

---

## Functionalities
The project implements three core operational tasks:

### 1. User Journey & Booking
* **Authentication:** Secure Registration and Login flow.
* **Interactive Seat Map:** Visual selection of seats with color-coded status (Available/Occupied/Selected).
* **My Tickets:** Users can view their booking history with generated QR codes.

### 2. Admin Dashboard
* **Content Management:** Automated movie import via **TMDB API** integration.
* **Screening Management:** Scheduling movie sessions for specific halls and times.
* **Analytics:** Real-time dashboard showing Total Revenue, Tickets Sold, and Active Movies.

### 3. Desktop Client (Java Swing)
* A native wrapper that encapsulates the web interface into a **Java Swing** `JFrame`.
* System integration including custom taskbar icons and resource loading.

---

## Tech Stack

### Backend
* **Framework:** Spring Boot 3 (Web, Security, Data JPA).
* **Database:** MySQL (Production) / H2 (Test).
* **Security:** Spring Security + JWT Filter.
* **API:** RESTful Architecture.

### Frontend
* **Library:** React 18 + TypeScript.
* **Styling:** Tailwind CSS (Dark Mode Cinema Theme).
* **Routing:** React Router DOM v6.
* **Build Tool:** Vite.

### Desktop
* **Core:** Java Swing (`JFrame`, `Toolkit`).
* **Integration:** Embedded Browser component.

---

## Algorithms & Data Structures
This project demonstrates the practical application of core Computer Science concepts:

### Data Structures
1.  **ArrayList / List:**
    * Used extensively for dynamic lists (e.g., `List<Movie>`, `List<Screening>`).
    * Chosen for $O(1)$ access time by index and efficient iteration.
2.  **HashMap / Map:**
    * Utilized in `JwtService` to handle token claims (Key-Value pairs for user data).
    * Used for mapping DTOs to Entity objects efficiently.
3.  **Set (HashSet):**
    * Used for storing User Roles (`Role`) to ensure unique privileges (no duplicate roles).
4.  **Optional:**
    * Applied in Repository layers to handle potential `null` values safely, preventing NullPointerExceptions.

### Algorithms
1.  **Sorting:**
    * Implemented a custom comparator to sort user tickets by date (Newest First):
      `tickets.sort((a, b) -> new Date(b.startTime).getTime() - new Date(a.startTime).getTime())`
2.  **Hashing:**
    * **BCrypt Algorithm:** Used for secure, salted password hashing before database storage.
    * **HMAC SHA-256:** Used for signing and verifying JSON Web Tokens.
3.  **Filtering:**
    * Java Stream API is used to filter active screenings based on Movie ID.
4.  **Complexity Analysis:**
    * Ticket Lookup: $O(N)$ (or $O(\log N)$ with DB indexing).
    * Seat Booking: $O(1)$ constant time operations.

---

## File Handling & Database

### Database (Relational Model)
All persistent data (Users, Movies, Tickets, Halls) is stored in a relational **MySQL** database.
* **Hibernate ORM:** Maps Java classes to database tables.
* **Initialization:** SQL scripts (`V1__init_movies.sql`) are executed at startup to populate the initial database state.

### File Handling (Input/Output)
File handling techniques are used for configuration and resource management:
1.  **Resource Loading (IO):** The Desktop Client uses `ClassLoader.getResource()` to read the `icon.png` file from the JAR archive's internal structure to set the application window icon.
2.  **Configuration Parsing:** The application reads and parses the `application.yml` file using File Input Streams to configure database connections and server ports.

---

## Setup & Installation

### Prerequisites
* JDK 17+
* Node.js 18+
* Maven

### 1. Run Backend
```bash
cd movie-booking/movie-service
mvn spring-boot:run
```

### 2. Run Frontend
```bash
cd cinema-enterprise-booking
npm install
npm run dev
```

### 3. Run Desktop Client
```bash
cd movie-booking/desktop-client
mvn package
java -jar target/desktop-client-1.0.jar
```

## Video Demo

    [Insert your Video Link Here]

## Author

Adilet Batyrov
