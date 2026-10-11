# DroneTV AI Support & Lead Assistant

A responsive full-stack demo application for the IPAGE Group Full Stack Developer Intern assignment. It includes a rule-based chatbot, customer/student enquiry form, REST API, MongoDB persistence, and a protected admin dashboard.

## Technologies
- Frontend: React, TypeScript, Vite, CSS, Axios, Lucide
- Backend: Node.js, Express, TypeScript, Mongoose
- Database: MongoDB Community Server
- Security: Helmet, CORS allow-list, Zod validation, bcrypt password hashing, JWT admin authentication, rate limiting, environment variables

## Features
- Responsive landing page, services and training sections
- Rule-based chatbot with suggested questions, fallback, session conversation history and reset
- Validated enquiry form (name, email, phone, user type, interest, message)
- MongoDB-backed enquiry CRUD
- Admin login, search, user-type/status filters, enquiry details, status changes and deletion
- Protected admin APIs, generic server errors, request size limits and rate limiting

## Project structure
- `frontend/` React app
- `backend/` Express API
- `docs/API_DOCUMENTATION.md` API reference
- `database/README.md` local database setup

## Prerequisites
Install Node.js LTS, Git, MongoDB Community Server and `mongosh`. Start the MongoDB service before running the backend.

## Setup
### 1. Configure backend
```powershell
cd backend
Copy-Item .env.example .env
npm install
```
Edit `backend/.env`. Set a unique random `JWT_SECRET` of at least 32 characters and a strong `ADMIN_PASSWORD` of at least 12 characters. Keep `.env` private; it is ignored by Git.

### 2. Create the local admin account
With MongoDB running and `.env` configured:
```powershell
npm run create-admin
```
This creates or updates the admin user using a bcrypt password hash. The login is not seeded with a public hardcoded password.

### 3. Run backend
```powershell
npm run dev
```
API: `http://localhost:5000`; health check: `http://localhost:5000/api/health`.

### 4. Run frontend in another terminal
```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173`.

### 5. Production build checks
In the frontend terminal run `npm run build`. In the backend terminal, stop the dev server and run `npm run build`.

## Environment variables
See `backend/.env.example` and `frontend/.env.example`. Never commit real secrets. `VITE_API_URL` is a public API URL, not a secret.

## API docs and database
See `docs/API_DOCUMENTATION.md` and `database/README.md`.

## Screenshots and video
Add genuine screenshots to `submission/02_Screenshots/` and a 5–10 minute walkthrough to `submission/05_Video_Walkthrough/` after running and testing the app. Explain the flow: React frontend → Express REST API → Mongoose → MongoDB.

## Before submission
- [ ] Test invalid form data and backend errors
- [ ] Test all CRUD operations and status updates
- [ ] Verify admin routes reject requests without a token
- [ ] Check mobile/tablet/desktop layout
- [ ] Add screenshots and a 5–10 minute video
- [ ] Update your resume PDF
- [ ] Create the required Google Drive folders and set viewer access
- [ ] Push source code to GitHub without `.env` or credentials

## Notes
This is an educational assessment starter. Review and understand the code before submission. Do not claim deployment or tests that you have not actually performed.
