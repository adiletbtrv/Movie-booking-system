# Movie Booking System

A premium, full-stack cinema management solution featuring a hybrid architecture. Built with Spring Boot and React, it seamlessly integrates web services with a native JavaFX desktop kiosk experience.

<img width="2560" height="1080" alt="image" src="https://github.com/user-attachments/assets/0bb4af7d-6827-4db1-b927-9c424e60365e" />

<img width="2560" height="1080" alt="image" src="https://github.com/user-attachments/assets/d0d63fbd-2c26-474c-98b8-e0842148c7c8" />

<img width="2560" height="1080" alt="image" src="https://github.com/user-attachments/assets/5474b1d8-a8b7-483e-9a2a-d76fcfa82649" />

## Features

- **Hybrid Architecture**: Unified web core serving both online users and physical terminal kiosks via a native JavaFX wrapper.
- **Interactive Booking**: High-performance seat map with real-time availability tracking and color-coded statuses.
- **Admin Intelligence**: 
  - Automated content sourcing via **TMDB API** integration.
  - Comprehensive analytics dashboard for revenue and ticket sales.
  - Dynamic screening and hall management.
- **Advanced Security**: Robust protection using **JWT** (JSON Web Tokens) and **BCrypt** salted hashing.
- **Desktop Integration**: Custom Java-JS bridge for streaming React logs to the Java system console and bidirectional communication.
- **Smart UX**: 
  - Dark-mode "Cinema Theme" with glassmorphism.
  - Automated QR code generation for ticket validation.
  - Responsive layout for all screen dimensions.

## Tech Stack

- **Backend**: Java 17, Spring Boot 3, Spring Security, Hibernate ORM.
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite.
- **Desktop**: JavaFX (WebView & WebEngine).
- **Database**: MySQL.

## Developer

Built by **Adilet Batyrov**.

- [LinkedIn](https://www.linkedin.com/in/adilet-batyrov/)
- [GitHub](https://github.com/adiletbtrv)

## Getting Started

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
