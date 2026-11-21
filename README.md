# Feedback Management System

**Team:** Darsh, Moshi, Sam

## Problem Statement

People give feedback about services, events and experiences, but it's easy to lose it, and nobody wants other people reading what they wrote. This project is a feedback app for that. A user registers with a username, email and password, then logs in to get a JWT access token and a refresh token. After login they can submit feedback (a subject, a message and a rating from 1 to 5) and see all the feedback they have submitted. Each user can only access their own feedback, and passwords are stored as hashes. It is built with a FastAPI + SQLite backend (port 8001) and a React frontend, and it will run in Docker and deploy to AWS EC2 through GitHub Actions.

## Database

One SQLite file, `feedback.db`, with two tables:

- **users:** id, username, email (unique), hashed_password, created_at
- **feedback:** id, user_id, subject, message, rating, created_at

## API Endpoints Contribution

| # | What it does | Method | Path | Request body | Success code | Error codes |
|:-:|:-------------|:------:|:-----|:-------------|:------------:|:------------|
| A1 | Register a new user | POST | /register | username<br>email<br>password | 201 | 409 (email already registered)<br>422 (missing or empty field, invalid email format) |
| A2 | Log in and get access and refresh tokens | POST | /login | email<br>password | 200 | 401 (wrong email or password)<br>422 (missing or empty field) |
| A3 | Get a new access token | POST | /refresh | refresh token | 200 | 401 (invalid or expired refresh token) |
| E1 | Get all feedback of the logged-in user | GET | /feedback | none (access token in the header) | 200 | 401 (missing, invalid or expired access token) |
| E2 | Submit new feedback | POST | /feedback | subject<br>message<br>rating (access token in the header) | 201 | 401 (missing, invalid or expired access token)<br>422 (empty subject or message, rating not between 1 and 5) |

## Frontend Contribution

| Member | Files | Endpoints | What they did |
|:---------:|:---------|:------------:|:-----------------|
| Darsh | not started yet | | |
| Moshi | not started yet | | |
| Sam | not started yet | | |

## Status so far

- The `users` and `feedback` tables are written in `model.py`.
- E1 (get the user's feedback) and E2 (submit feedback) are written in `functions.py`.
- The Dockerfile and the GitHub Actions workflow file are in the repo, and are still being finished.
- The React frontend and the EC2 deployment have not been started.

## How to Run

### Backend
1. Install Python 3.12, the same version the Dockerfile uses.
2. Open a terminal and go to the backend folder:
   ```bash
   cd backend
   ```
3. Create and turn on a virtual environment:
   ```bash
   py -3.12 -m venv venv
   venv\Scripts\Activate.ps1
   ```
4. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the FastAPI server on port 8001:
   ```bash
   uvicorn main:app --reload --port 8001
   ```
6. Open the interactive docs:
   - Swagger UI: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)

### Frontend
Coming soon.

### Proof of work

Screenshot of `/docs` to be added once the endpoints are working.