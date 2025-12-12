# Movie Booking System

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

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

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Functionalities](#-functionalities)
3. [Tech Stack](#-tech-stack)
4. [Algorithms & Data Structures](#-algorithms--data-structures)
5. [File Handling & Database](#-file-handling--database)
6. [Setup & Installation](#-setup--installation)
7. [Video Demo](#-video-demo)

---

## Project Overview
Cinema Enterprise Booking is a comprehensive solution for managing movie theater operations. It demonstrates a **Hybrid Architecture** where the same web core serves both online users and terminal kiosks via a native wrapper.

**Key Highlights:**
* **Hybrid Platform:** Web version for remote access + **JavaFX Desktop** version for ticket counters.
* **Java-JS Bridge:** Implemented a custom bridge to stream React logs directly into the Java System Console for debugging.
* **Security:** Robust authentication using JWT (JSON Web Tokens) and BCrypt hashing.

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

### 3. Desktop Client (JavaFX)
* A native application built with **JavaFX** and **WebView**.
* It encapsulates the React application, providing a native look and feel with custom application icons and window management.

---

## Tech Stack

### Backend
* **Framework:** Spring Boot 3 (Web, Security, Data JPA).
* **Database:** MySQL (Production).
* **Security:** Spring Security + JWT Filter.

### Frontend
* **Library:** React 18 + TypeScript.
* **Styling:** Tailwind CSS (Dark Mode Cinema Theme).
* **Build Tool:** Vite.

### Desktop
* **Core:** JavaFX (`Stage`, `Scene`, `WebView`, `WebEngine`).
* **Integration:** Custom `JavaConsoleBridge` for logging and bidirectional communication.

---

## Algorithms & Data Structures
This project demonstrates the practical application of core Computer Science concepts:

### Data Structures
1.  **ArrayList / List:**
    * Used extensively for dynamic lists (e.g., `List<Movie>`).
    * Chosen for $O(1)$ access time by index.
2.  **HashMap / Map:**
    * Utilized in `JwtService` to handle token claims (Key-Value pairs).
3.  **Set (HashSet):**
    * Used for storing User Roles (`Role`) to ensure unique privileges.
4.  **Optional:**
    * Applied in Repository layers to handle `null` values safely.

### Algorithms
1.  **Sorting:**
    * Custom comparator to sort user tickets by date (Newest First):
        `tickets.sort((a, b) -> new Date(b.startTime).getTime() - new Date(a.startTime).getTime())`
2.  **Hashing:**
    * **BCrypt Algorithm:** Secure, salted password hashing.
    * **HMAC SHA-256:** Signing JSON Web Tokens.
3.  **Filtering:**
    * Java Stream API used to filter active screenings by Movie ID.

---

## File Handling & Database

### Database (Relational Model)
All persistent data is stored in a relational **MySQL** database using **Hibernate ORM**.

### File Handling (Input/Output)
File handling is critically used in the Desktop Module and Configuration:
1.  **Resource Loading (JavaFX Image I/O):**
    The application utilizes `getClass().getResource("/icon.png")` to perform file I/O operations. It reads the binary image stream from the JAR classpath and converts it into a JavaFX `Image` object to set the stage icon:
    ```java
    primaryStage.getIcons().add(new Image(iconURL.toExternalForm()));
    ```
2.  **Configuration Parsing:** Spring Boot reads `application.yml` via File Input Streams.
3.  **SQL Migrations:** The system reads `.sql` files from the disk to initialize the schema.

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

[https://drive.google.com/file/d/1N954j9qTpzz1JDFzPTAsl2AumQI0twSw/view?usp=sharing]

## Author

Adilet Batyrov
