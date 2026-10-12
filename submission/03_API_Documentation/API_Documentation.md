# API Documentation

Base URL: `http://localhost:5000/api`

## Health
- `GET /health` — returns `{ "status": "ok" }` when the server is running.

## Authentication
- `POST /auth/login` — public; accepts `{ "email": "...", "password": "..." }`; returns a JWT token.
- Send `Authorization: Bearer <token>` for all enquiry read/update/delete operations.
- Tokens expire according to `JWT_EXPIRES_IN` (default `8h`).

## Enquiries
### Create (public)
`POST /enquiries`
```json
{
  "name": "Asha Patil",
  "email": "asha@example.com",
  "phone": "+91 98765 43210",
  "userType": "Student",
  "interest": "Drone Training",
  "message": "Please share upcoming course details."
}
```
Returns `201 Created` and the stored enquiry. Status defaults to `New`.

### List (admin)
`GET /enquiries`
Optional query parameters: `search`, `userType` (`Student`, `Customer`, `Other`), `status` (`New`, `Contacted`, `In Progress`, `Closed`). Results are newest first, capped at 500 records.

### Read one (admin)
`GET /enquiries/:id`

### Partial update (admin)
`PATCH /enquiries/:id`
Example body:
```json
{ "status": "Contacted" }
```

### Full update (admin)
`PUT /enquiries/:id`
Requires all fields accepted by the create endpoint.

### Delete (admin)
`DELETE /enquiries/:id` — returns `204 No Content`.

## Error responses
- `400` invalid body, field validation failure, or malformed ID
- `401` missing/invalid/expired admin token or invalid credentials
- `404` endpoint or enquiry not found
- `429` rate limit exceeded
- `500` generic server error (no stack trace exposed)

## Security
- Backend validates all user input with Zod; frontend validation is only for usability.
- Helmet security headers, restricted CORS origin, request body size limit, and rate limiting are enabled.
- Passwords are bcrypt-hashed; admin endpoints require JWT.
- Do not share `.env` or commit secrets.
