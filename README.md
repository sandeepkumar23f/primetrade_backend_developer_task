# PrimeTrade – Scalable Backend API with Role-Based Access
Github: https://github.com/sandeepkumar23f/primetrade_backend_developer_task
## Overview

This project is a backend system built to demonstrate how a real-world API should be structured when authentication, authorization, and scalability are important concerns.

The core idea was not just to make endpoints work, but to design them in a way that they remain maintainable and extensible as the system grows. Alongside the backend, a minimal frontend is included to validate and interact with the APIs.

---

## Tech Stack

* Node.js, Express.js
* MongoDB
* JWT for authentication
* bcrypt for password hashing
* Next.js (frontend for API interaction)

---

## What This Project Solves

Most beginner APIs stop at CRUD. This project goes a step further by introducing:

* Secure authentication flow
* Role-based access control (user vs admin)
* Ownership-based data access (users manage only their own data)
* Clean API structuring with versioning
* Separation of concerns across controllers, routes, and middleware

---

## Architecture Overview

The backend follows a modular structure:

* **Controllers** → handle business logic
* **Routes** → define API endpoints
* **Middleware** → authentication & authorization
* **Config** → database connection

This separation keeps the codebase scalable and easy to extend.

---

## Authentication & Authorization

Authentication is handled using JWT. On successful login or registration, a token is issued which must be included in protected requests.

Authorization is enforced at two levels:

1. **Authentication check** → verifies if the user is logged in
2. **Role-based control** → restricts access based on user role

Additionally, task-level ownership is enforced:

* Regular users can only access their own tasks
* Admins have access to all tasks

---

## API Design

All endpoints are versioned:

```
/api/v1/...
```

### Auth Routes

* `POST /api/v1/auth/register` → Register user
* `POST /api/v1/auth/login` → Login user

### Task Routes

* `POST /api/v1/tasks` → Create task
* `GET /api/v1/tasks` → Get tasks (filtered by role)
* `GET /api/v1/tasks/:id` → Get single task
* `PUT /api/v1/tasks/:id` → Update task
* `DELETE /api/v1/tasks/:id` → Delete task

---

## Request / Response Example

### Register

```json
{
  "name": "Sandeep",
  "email": "sandeepk572y@gmail.com",
  "password": "Password@12"
}
```

### Login Response

```json
{
  "success": true,
  "token": "jwt_token",
  "role": "user"
}
```

---

## Database Design

### User

* name (String)
* email (String, unique)
* password (hashed)
* role (user/admin)

### Task

* title (String)
* description (String)
* userId (ObjectId reference)

The schema is intentionally simple but structured to support future extensions like task status, deadlines, or tagging.

---

## Error Handling Strategy

The API follows a consistent error structure:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

Standard HTTP status codes are used to indicate the nature of the failure (400, 401, 403, 404, 500).

---

## Security Considerations

* Passwords are hashed using bcrypt before storage
* JWT is verified on every protected request
* Sensitive routes are protected via middleware
* Role-based access prevents unauthorized operations

For production:

* Tokens should be stored in httpOnly cookies
* Rate limiting and input sanitization should be added

---

## Frontend (Support Layer)

A simple Next.js frontend is included to:

* Register and log in users
* Store JWT locally
* Access protected routes
* Perform CRUD operations on tasks

The frontend is intentionally minimal, as the focus of this assignment is backend design.

---

## Setup

### Backend

```bash
git clone <repo-url>
cd backend
npm install
```

Create `.env`:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000
```

Run:

```bash
nodemon server.js
```

---

### Frontend

```bash
cd frontend
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

---

## Scalability Notes

This project is structured to scale with minimal refactoring:

* Modules can be split into microservices (auth, tasks)
* Redis can be introduced for caching
* Logging can be added using Winston or Morgan
* Docker can be used for containerized deployment
* Database indexing can improve query performance

---

## Final Thoughts

The goal of this project was to go beyond a basic CRUD API and build something that reflects how backend systems are designed in real-world applications — with proper structure, security, and scalability in mind.
