# Global Chat App

A real-time global chat application built with:

- Backend: Node.js, Express, TypeScript, MongoDB, Socket.IO
- Frontend: React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Socket.IO client
- Auth: JWT (HTTP-only cookies), bcrypt
- Infra helpers: pnpm workspaces, modular architecture

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
docker-compose up --build
```

This will:
- Build and start:
  - `backend` on `http://localhost:8000`
  - `frontend` on `http://localhost:5173`

To run in the background:

```sh
docker-compose up -d
```

### 3. Access the App

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:8000/health`

### 4. Stopping the Services

To stop and remove containers:

```sh
docker-compose down
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

## Features

- Authentication
  - Register, login with email/password
  - Secure JWT auth stored in HTTP-only cookie
  - Protected REST APIs via authorization middleware
- User Management
  - Online/offline status tracking
  - Get own profile (`/user/self`)
  - Edit profile (username)
  - Delete account
  - Total users count and active users list
- Global Chat
  - Single global room for all authenticated users
  - Real-time messaging with Socket.IO
  - Messages persisted in MongoDB
  - Paginated chat history with smooth infinite scroll
  - Displays sender avatar initials, timestamps, alignment by author
- Presence & Events
  - Marks user `isOnline` on login and socket connect
  - Broadcasts `user_joined` and `user_left` events
  - Sidebar shows active users in real-time
- UI/UX
  - Responsive layout with header, sidebar, and main chat area
  - Theming support via `ThemeContext`
  - Reusable UI primitives: buttons, inputs, fields, scroll area, textarea, etc.
  - Toast notifications for feedback

## Tech Stack

### Backend (`/backend`)

- TypeScript + Express
- MongoDB + Mongoose
- Socket.IO server
- JWT (via `jsonwebtoken`)
- bcrypt for password hashing
- CORS + cookie-parser

Key modules:

- [backend/src/express.ts](backend/src/express.ts)
  - Configures Express, CORS, cookies, JSON parsing
  - Mounts:
    - `/api/v1/auth`
    - `/api/v1/user`
    - `/api/v1/chat`
    - `/health` (health check)
- [backend/src/index.ts](backend/src/index.ts)
  - Connects to MongoDB via [`utils/constant.db_name`](backend/src/utils/constant.ts)
  - Creates HTTP server and Socket.IO server
  - Socket.IO auth using JWT from cookies
  - Attaches [`socket.socketHandler`](backend/src/socket/socket.ts)
- [backend/src/routes/auth.route.ts](backend/src/routes/auth.route.ts)
  - `POST /login` → [`auth.login`](backend/src/controllers/auth.controller.ts)
  - `POST /register` → [`auth.register`](backend/src/controllers/auth.controller.ts)
  - `POST /logout` (protected) → [`auth.logout`](backend/src/controllers/auth.controller.ts)
- [backend/src/routes/user.route.ts](backend/src/routes/user.route.ts)
  - Protected:
    - `GET /` → [`user.getAllUser`](backend/src/controllers/user.controller.ts) (total users)
    - `PATCH /` → [`user.editUserInfo`](backend/src/controllers/user.controller.ts)
    - `DELETE /` → [`user.removeUser`](backend/src/controllers/user.controller.ts)
    - `GET /self` → [`user.getUserInfo`](backend/src/controllers/user.controller.ts)
    - `GET /active` → [`user.getActiveUser`](backend/src/controllers/user.controller.ts)
- [backend/src/routes/chat.route.ts](backend/src/routes/chat.route.ts)
  - `GET /` (protected, paginated) → [`chat.getAllChat`](backend/src/controllers/chat.controller.ts)
- [backend/src/controllers/auth.controller.ts](backend/src/controllers/auth.controller.ts)
  - Register: validate, hash, create user
  - Login: validate, verify password, set `access_token` cookie, mark `isOnline`
  - Logout: clear cookie, mark `isOnline = false`
- [backend/src/controllers/user.controller.ts](backend/src/controllers/user.controller.ts)
  - User info, edit profile, delete user, total users, active users
- [backend/src/controllers/chat.controller.ts](backend/src/controllers/chat.controller.ts)
  - Returns chat history with pagination and `totalPage`
- [backend/src/middleware/auth.middleware.ts](backend/src/middleware/auth.middleware.ts)
  - `authorization()`:
    - Reads `access_token` from cookies
    - Verifies JWT via [`utils.jwtVerify`](backend/src/utils/jwt.ts)
    - Ensures user exists and token not expired
    - Injects `req.user`
- [backend/src/socket/socket.ts](backend/src/socket/socket.ts)
  - On connection:
    - Finds user from `socket.userId`
    - Sets `isOnline = true`, emits `user_joined`
  - On `"message"`:
    - Persists chat to [`models.Chat`](backend/src/models/chat.model.ts)
    - Broadcasts message payload to all clients
  - On `disconnect`:
    - Sets `isOnline = false`
    - Emits `user_left`
- [backend/src/models/user.model.ts](backend/src/models/user.model.ts)
  - `User` schema: `username`, `email`, `password`, `isOnline`
- [backend/src/models/chat.model.ts](backend/src/models/chat.model.ts)
  - `Chat` schema: `sender` (ref `User`), `message`, timestamps
- [backend/src/utils/jwt.ts](backend/src/utils/jwt.ts)
  - `jwtSigh` (sign)
  - `jwtVerify` (verify)
- [backend/src/utils/bcrypt.passwordhash.ts](backend/src/utils/bcrypt.passwordhash.ts)
  - Hash/compare helpers
- [backend/src/utils/asyncHandler.ts](backend/src/utils/asyncHandler.ts)
  - Async controller wrapper

### Frontend (`/frontend`)

- React + TypeScript + Vite
- Tailwind CSS + Shadcn UI
- Socket.IO client
- React Router
- React Hot Toast

Key modules:

- [frontend/src/main.tsx](frontend/src/main.tsx)
  - Bootstraps app with [`AppProvider`](frontend/src/contexts/AppProvider.tsx)
- [frontend/src/contexts/AppProvider.tsx](frontend/src/contexts/AppProvider.tsx)
  - Wraps:
    - [`ThemeContext`](frontend/src/contexts/ThemeContext.tsx)
    - [`AuthContext`](frontend/src/contexts/AuthContext.tsx)
    - [`SocketProvider`](frontend/src/contexts/SocketContext.tsx)
- [frontend/src/contexts/AuthContext.tsx](frontend/src/contexts/AuthContext.tsx)
  - Holds logged-in user `{ _id, username }`
- [frontend/src/contexts/SocketContext.tsx](frontend/src/contexts/SocketContext.tsx)
  - Connects to `VITE_API_URL` via Socket.IO with `withCredentials`
  - Exposes `useSocket()`
- [frontend/src/contexts/ThemeContext.tsx](frontend/src/contexts/ThemeContext.tsx)
  - Light/dark/system theme with `localStorage`
- [frontend/src/App.tsx](frontend/src/App.tsx)
  - Routes:
    - `/` → [`Home`](frontend/src/pages/Home.tsx)
    - `/sign-in` → [`SignIn`](frontend/src/pages/SignIn.tsx)
    - `/sign-up` → [`SignUp`](frontend/src/pages/SignUp.tsx)
    - `/dashboard` → [`Dashboard`](frontend/src/pages/Dashboard.tsx) (protected)
    - `/profile/:_id` → [`Profile`](frontend/src/pages/Profile.tsx) (protected)
    - `*` → [`NotFound`](frontend/src/pages/NotFound.tsx)
  - `ProtectedRoute` guards by `AuthContext`
- [frontend/src/components/Header.tsx](frontend/src/components/Header.tsx)
  - Top nav, auth-aware buttons, logout integration
- [frontend/src/pages/Home.tsx](frontend/src/pages/Home.tsx)
  - Marketing/landing, backend health check
- [frontend/src/pages/SignUp.tsx](frontend/src/pages/SignUp.tsx)
  - Register form with validation feedback using
    - [`Field`](frontend/src/components/ui/field.tsx)
    - [`Input`](frontend/src/components/ui/input.tsx)
- [frontend/src/pages/SignIn.tsx](frontend/src/pages/SignIn.tsx)
  - Login form, sets user in `AuthContext`, navigates to dashboard
- [frontend/src/pages/Dashboard.tsx](frontend/src/pages/Dashboard.tsx)
  - Layout:
    - [`SideBar`](frontend/src/components/SideBar.tsx)
    - [`ChatArea`](frontend/src/components/ChatArea.tsx)
- [frontend/src/pages/Profile.tsx](frontend/src/pages/Profile.tsx)
  - Fetches `/user/self`, edit username, shows metadata
- [frontend/src/components/SideBar.tsx](frontend/src/components/SideBar.tsx)
  - Loads:
    - Total users from `/api/v1/user`
    - Active users from `/api/v1/user/active`
  - Subscribes to `user_joined` and `user_left` socket events
  - Navigates to profile
- [frontend/src/components/ChatArea.tsx](frontend/src/components/ChatArea.tsx)
  - Loads initial chats from `/api/v1/chat` with pagination
  - Infinite scroll for older messages
  - Listens for `message` events from socket
  - Sends messages via socket `"message"` event
  - Scroll behavior tuned for good UX
- [frontend/src/components/ui/*](frontend/src/components/ui)
  - Reusable components from Shadcn UI : button, input, textarea, label, field, separator, scroll-area


## License

This project is open for learning and portfolio use.