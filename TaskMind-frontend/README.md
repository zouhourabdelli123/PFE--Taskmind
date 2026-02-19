# TaskMind Frontend

Frontend React (Vite) separe du backend Laravel `TaskMind`.

## Features

- Authentification avec token Sanctum (`/auth/login`, `/auth/me`, `/auth/logout`)
- CRUD Teams avec DataGrid
- CRUD Projects avec DataGrid
- CRUD Tasks avec DataGrid
- Design moderne responsive (desktop + mobile)

## Stack

- React + Vite
- MUI + MUI Data Grid
- React Router
- React Query
- Axios

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

## Configuration API

Definir `VITE_API_BASE_URL` dans `.env`.

Exemple:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Auth backend attendu

Le backend Laravel doit exposer:

- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `GET|POST|PUT|DELETE /teams`
- `GET|POST|PUT|DELETE /projects`
- `GET|POST|PUT|DELETE /tasks`
