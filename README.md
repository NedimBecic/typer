# Typer

As I recently bought a split keyboard I wanted to practice typing, so I created this project. This is a web app for practicing typing, something similar to typingmonkey. 

It is built with a **Java Spring Boot** backend and a **React (Vite)** frontend.

## Features

- **Time Mode**: Infinite words with a countdown timer.
- **Words Mode**: Fixed number of words with a stopwatch.
- **Session Statistics**: Tracks average WPM, accuracy, and most frequently missed characters.
- **No Persistence**: All stats are session-based and reset when the server restarts.

## Word Generation

Words are generated on the backend using a curated list of the **200 most common English words**.

- The list is stored in memory on the server.
- Words are selected randomly to ensure a varied typing experience.

## Getting Started

### Backend (Java Spring Boot)

Requires Java 17+.

```bash
cd backend
mvn spring-boot:run
```

The server runs on `http://localhost:8080`.

### Frontend (React)

Requires Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.
