# Global Chat App

A real-time global chat application built with:

- Backend: Node.js, Express, TypeScript, MongoDB, Socket.IO
- Frontend: React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Socket.IO client
- Auth: JWT (HTTP-only cookies), bcrypt
- Infra helpers: pnpm workspaces, modular architecture

##  Hosted Live Demo

**Frontend:** https://chatapp-frontend-v1.onrender.com  
**Backend:** https://chatapp-backend-v1.onrender.com  

**Note:** Both services are hosted on Render's free tier. Instances spin down after inactivity and take ~50 seconds to wake up on first request.

**Pro Tip:** Click the frontend link first → then immediately on `https://chatapp-backend-v1.onrender.com/health` to wake up the backend instance parallelly to frontend!

## Getting Started (Normal Way)

This repository uses `pnpm` .

1. Install dependencies (from project root):

   ```sh
   pnpm install
   ```

2. Set environment variables:

   - `backend/.env`
     - `PORT=8000`
     - `MONGO_DB_URL=<your_mongodb_connection_string>`
     - `JWT_SECRET=<your_jwt_secret>`
     - `JWT_EXPIRE=3d`
     - `COOKIE_EXPIRE=3`
     - `ORIGIN=http://localhost:5173`
   - `frontend/.env`
     - `VITE_API_URL=http://localhost:8000`

3. Start both backend and frontend together (from root):

   ```sh
   pnpm dev
   ```

   This runs:
   - Backend on: `http://localhost:8000`
   - Frontend on: `http://localhost:5173`

4. Open the app:

   - Frontend: `http://localhost:5173`
   - Health check: `http://localhost:8000/health`


## Getting Started (Docker Compose)

This project includes a Docker-based setup to run both the backend and frontend with a single command using `docker-compose`.

1. Install dependencies (from project root):

   ```sh
   pnpm install
   ```

### Prerequisites

- Docker installed
- Docker Compose installed (or Docker Desktop with Compose support)

### 1. Configure Environment Variables

Create the backend environment file:

```sh
cp backend/.env.example backend/.env
```

Then edit `backend/.env` with your values:

```env
PORT=8000
MONGO_DB_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRE=3d
COOKIE_EXPIRE=3
ORIGIN=http://localhost:5173
```

Notes:
- `MONGO_DB_URL` must point to a reachable MongoDB instance (local or cloud).
- `ORIGIN` should match the frontend URL exposed by Docker (`http://localhost:5173` by default).

No separate `.env` is required for the frontend when using the provided `docker-compose.yml` because `VITE_API_URL` is passed as a build argument and set to `http://localhost:8000`.

### 2. Build and Start Services

From the project root:

```sh
docker compose build
```

This will:
- Build and start:
  - `backend` on `http://localhost:8000`
  - `frontend` on `http://localhost:5173`

To run in the background:

```sh
docker compose up
```

### 3. Access the App

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:8000/health`

### 4. Stopping the Services

To stop and remove containers:

```sh
docker compose down
```


## API Overview (Quick Reference)

- Auth:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/logout`
- User (protected):
  - `GET /api/v1/user` – total users
  - `GET /api/v1/user/self` – current user
  - `GET /api/v1/user/active` – active users
  - `PATCH /api/v1/user` – update username
  - `DELETE /api/v1/user` – delete account
- Chat (protected):
  - `GET /api/v1/chat?page=<number>&limit=<number>` – paginated messages
- Health:
  - `GET /health`

## Socket.IO Events

- From server:
  - `message` – new chat message
  - `user_joined` – user came online
  - `user_left` – user went offline 
- From client:
  - `message` – send new message payload

Authentication for sockets:

- Uses `access_token` HTTP-only cookie set on login.
- Socket connection is rejected if token is missing or invalid.

## Project Structure
  - `/backend` – API + WebSocket server
  - `/frontend` – React client
  - `README.md` – project documentation
## License
  This project is open for learning and portfolio use.