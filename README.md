# Full Stack AI Support & Lead Assistant

A responsive full-stack web application developed by **Paravin Mulla** for the IPAGE Group Full Stack Developer Internship assignment.

The application provides a rule-based chatbot, customer and student enquiry form, REST API, MongoDB database integration, and an admin dashboard for managing enquiries.

## Features

- Responsive landing page with services and training sections
- Rule-based chatbot with suggested questions and fallback responses
- Chat conversation history and reset functionality
- Enquiry form with input validation
- Customer and student enquiry management
- REST API integration between frontend and backend
- MongoDB persistence using Mongoose
- Secure admin login with JWT authentication
- Password hashing using bcrypt
- Protected admin API routes
- Enquiry search and filtering
- Enquiry details, status updates, and deletion
- Backend validation and error handling
- Security features including Helmet, CORS configuration, and rate limiting
- Environment-based configuration for sensitive settings

## Technologies Used

### Frontend
- React.js
- TypeScript
- Vite
- Axios
- CSS
- Lucide icons

### Backend
- Node.js
- Express.js
- TypeScript
- Mongoose
- Zod validation
- JWT authentication
- bcrypt
- Helmet
- Express rate limiting

### Database
- MongoDB Community Server

### Development Tools
- Git
- GitHub
- Visual Studio Code
- Postman

## Project Structure

```text
FullStack_Chatbot_Task_Paravin_Mulla/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── docs/
│   └── API_DOCUMENTATION.md
├── database/
│   └── README.md
├── submission/
│   ├── 02_Screenshots/
│   └── 05_Video_Walkthrough/
├── .gitignore
└── README.md
```

*Note: The structure above is illustrative. Adjust it to match the actual files and folders in your repository.*

## Prerequisites

Install the following before running the application:

- Node.js LTS and npm
- Git
- MongoDB Community Server
- `mongosh` (MongoDB Shell)

Ensure that MongoDB is running before starting the backend.

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd FullStack_Chatbot_Task_Paravin_Mulla
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Configure the backend

Open a terminal in the project root and run:

```powershell
cd backend
Copy-Item .env.example .env
npm install
```

Open `backend/.env` and configure the required environment variables according to `backend/.env.example`.

Use a strong, unique JWT secret of at least 32 characters and a strong admin password of at least 12 characters, if required by the implementation.

**Security:** Never commit your `.env` file, passwords, tokens, or database credentials to GitHub.

### 3. Create the admin account

Ensure MongoDB is running and the backend environment variables are configured.

Run this command from the `backend/` directory if the project includes the `create-admin` script:

```bash
npm run create-admin
```

Follow the configuration used by the application to log in to the admin dashboard.

### 4. Start the backend

From the `backend/` directory, run:

```bash
npm run dev
```

The backend API is expected to run at:

```text
http://localhost:5000
```

Health check endpoint:

```text
http://localhost:5000/api/health
```

Confirm the actual port and endpoint in the backend configuration.

### 5. Configure and start the frontend

Open a second terminal:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open the local frontend URL shown in the terminal. With the default Vite configuration, it is usually:

```text
http://localhost:5173
```

Configure `VITE_API_URL` in the frontend environment file according to the backend API URL expected by the application.

### 6. Build the project

Check the frontend production build:

```bash
cd frontend
npm run build
```

Check the backend production build:

```bash
cd backend
npm run build
```

Run these commands from their respective directories. They require matching scripts to be defined in each `package.json`.

## Application Workflow

1. The user opens the application.
2. The user interacts with the rule-based chatbot or enters an enquiry.
3. The frontend validates the enquiry and sends a request to the backend.
4. The backend validates and processes the request.
5. The enquiry is stored in MongoDB.
6. The administrator logs in to the protected dashboard.
7. The administrator can view, search, filter, update, and delete enquiries.

**Architecture:**

```text
React + TypeScript Frontend
            |
            v
     Express REST API
            |
            v
      Mongoose ODM
            |
            v
         MongoDB
```

## API Documentation

API documentation is maintained in:

`docs/API_DOCUMENTATION.md`

It should describe the implemented endpoints, HTTP methods, request parameters, authentication requirements, validation rules, and response formats.

Use the actual API documentation in the repository as the source of truth for endpoint details.

## Database Setup

Database setup instructions are maintained in:

`database/README.md`

The application uses MongoDB with Mongoose for data persistence. Configure the database connection using the environment variables documented in `backend/.env.example`.

Do not publish database credentials or real user information.

## Screenshots and Video Demonstration

Add genuine screenshots of the running application to:

`submission/02_Screenshots/`

Recommended screenshots:

- Home page
- Chatbot interaction
- Enquiry form and validation
- Admin login
- Admin dashboard
- Search and filtering
- Enquiry status update
- Responsive mobile layout

Add the project walkthrough video to:

`submission/05_Video_Walkthrough/`

The video should demonstrate the actual working application, including the frontend, backend API, database integration, and admin dashboard.

## Testing Checklist

Before submitting the project, verify the following:

- [ ] The frontend starts successfully.
- [ ] The backend starts successfully.
- [ ] MongoDB connection works.
- [ ] The chatbot responds to supported questions.
- [ ] The enquiry form validates input correctly.
- [ ] New enquiries are saved to the database.
- [ ] Admin login works with configured credentials.
- [ ] Protected APIs reject requests without valid authentication.
- [ ] Search and filters return the expected results.
- [ ] Enquiry status updates and deletion work.
- [ ] Backend errors are handled appropriately.
- [ ] The layout works on desktop, tablet, and mobile.
- [ ] Frontend and backend production builds succeed.
- [ ] No secrets or `.env` files are committed to GitHub.

## Security Notes

- Store secrets in environment variables.
- Keep `.env` files out of version control.
- Use password hashing for admin credentials.
- Protect administrative endpoints with authentication.
- Validate incoming request data on the backend.
- Configure CORS for the intended frontend origin.
- Do not include real customer data in screenshots or demonstrations.

## Assignment Information

**Candidate:** Paravin Mulla

**Assignment:** Full Stack Developer Intern

**Organization:** IPAGE Group

**Project:** Full Stack AI Support & Lead Assistant

This project was developed for educational and technical assessment purposes. It is an independent demonstration project and is not an official application of DroneTV or IPAGE Group.

## Author

**Paravin Mulla**

- GitHub: https://github.com/ParavinMulla786
- LinkedIn: https://linkedin.com/in/paravin-mulla-bb2abb2b7/
- Email: paravinmulla2004@gmail.com