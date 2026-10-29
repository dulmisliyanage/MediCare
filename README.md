
# MediCare — Healthcare Appointment Booking System

MediCare is a full-stack healthcare appointment booking and management system designed to simplify interactions between patients and healthcare providers.

The platform allows patients to explore medical services, browse doctors, request appointments, and contact the healthcare team through a responsive website.

It also includes a secure admin dashboard for managing appointment requests, viewing appointment statistics, and handling contact messages.

## Live Demo

**Live Website:** https://medicare-client-nu.vercel.app

**Backend API:** https://medicare-backend-zfwh.onrender.com/api

**Admin Login:** https://medicare-client-nu.vercel.app/admin/login.html

> Admin dashboard access requires valid administrator credentials.

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Lucide Icons

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB Atlas
- Mongoose

### Authentication & Security
- JSON Web Tokens (JWT)
- bcrypt
- Protected API Routes
- Environment Variables

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Version Control:** Git & GitHub

## Key Features

### Patient Website
- Responsive healthcare website
- Medical services section
- Doctor listings with search and filtering
- Doctor profile modal
- Appointment request form
- Contact Us form with MongoDB integration
- Form validation and user feedback

### Admin Dashboard
- Secure admin login with JWT authentication
- Appointment management dashboard
- Appointment statistics
- View appointment details
- Confirm or cancel appointment requests
- Search and filter appointments
- View contact messages
- Automatically mark unread messages as read
- Persistent appointment and message status updates

## System Architecture

MediCare follows a client-server architecture.

```text
Patient / Administrator
          |
          v
Frontend (HTML, CSS, JavaScript)
       Vercel
          |
          | HTTP Requests / REST APIs
          v
Backend (Node.js + Express.js)
        Render
          |
          | Mongoose
          v
Database (MongoDB Atlas)
```

### How It Works

1. A patient visits the MediCare website.
2. The patient browses doctors or medical services.
3. The patient submits an appointment request or contact message.
4. JavaScript sends the request to the Express backend.
5. The backend validates and processes the submitted data.
6. Mongoose communicates with MongoDB Atlas.
7. The submitted information is stored in the database.
8. An administrator logs in through the admin login page.
9. The backend authenticates the administrator using JWT.
10. The administrator can view and manage appointments and contact messages.

## Project Structure

```text
MediCare/
├── client/
│   ├── admin/
│   │   ├── login.html
│   │   ├── login.js
│   │   ├── dashboard.html
│   │   ├── dashboard.js
│   │   └── admin.css
│   ├── assets/
│   │   └── images/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── index.html
│
├── server/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Appointment.js
│   │   └── ContactMessage.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── contactRoutes.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── server.js
│   └── package.json
│
├── Screenshots/
│   ├── homepage.png
│   ├── doctors.png
│   ├── appointment.png
│   ├── admin-dashboard.png
│   └── contact-messages.png
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Git
- VS Code or another code editor
- MongoDB Atlas account
- Live Server extension (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/dulmisliyanage/MediCare.git
cd MediCare
```

### 2. Install Backend Dependencies

Navigate to the backend directory:

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Replace the placeholder values with your own credentials.

**Important:** Never commit your `.env` file or expose database credentials and JWT secrets publicly.

### 4. Start the Backend

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

The backend runs locally at:

http://localhost:5000

Test the API:

http://localhost:5000/api

A successful response indicates that the API server is running.

### 5. Start the Frontend

Open:

`client/index.html`

Launch the file using Live Server in VS Code or Antigravity IDE.

**Note:** The current frontend API URLs point to the deployed Render backend.

To use a local backend instead, update the API URLs in:

- `client/js/script.js`
- `client/admin/login.js`
- `client/admin/dashboard.js`

Change the backend hostname to:

`http://localhost:5000`

### 6. Access the Admin Dashboard

Open:

`client/admin/login.html`

Or use the deployed admin login:

https://medicare-client-nu.vercel.app/admin/login.html

Sign in using an admin account created through the backend setup process.

Admin credentials are not included in this repository.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate an administrator |

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Submit an appointment request |
| GET | `/api/appointments` | Retrieve appointments (Admin) |
| PATCH | `/api/appointments/:id/status` | Update appointment status (Admin) |

### Contact Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit a contact message |
| GET | `/api/contact` | Retrieve contact messages (Admin) |
| PATCH | `/api/contact/:id/read` | Mark a message as read (Admin) |

Protected endpoints require a valid admin JWT.

## Database Models

MediCare uses MongoDB Atlas with Mongoose for database operations.

### Admin

Stores administrator account information used for secure authentication.

### Appointment

Stores appointment requests submitted by patients and the information needed to manage their status.

### ContactMessage

Stores contact form submissions and their read/unread status.

## Authentication Process

1. The administrator opens the login page.
2. The administrator enters login credentials.
3. The frontend sends a request to `/api/auth/login`.
4. The backend verifies the credentials.
5. bcrypt is used to verify the password against its stored hash.
6. After successful authentication, the backend generates a JWT.
7. The frontend uses the token when requesting protected resources.
8. Authentication middleware verifies the token before allowing access to protected endpoints.

## Security

MediCare implements several security measures:

- Admin passwords are hashed using bcrypt.
- JWT is used for admin authentication.
- Protected API routes require valid authentication tokens.
- Environment variables store sensitive configuration.
- `.env` files are excluded from Git version control.
- Backend validation is used for submitted form data.
- Admin credentials are not publicly included in the repository.

## Deployment

### Frontend — Vercel

The MediCare frontend is successfully deployed on Vercel.

**Live Website:**

https://medicare-client-nu.vercel.app

**Admin Login:**

https://medicare-client-nu.vercel.app/admin/login.html

The frontend communicates with the deployed Render backend through REST APIs.

### Backend — Render

The Node.js and Express backend is deployed on Render and connected to MongoDB Atlas.

**Live Backend API:**

https://medicare-backend-zfwh.onrender.com/api

The backend handles:

- Admin authentication
- Appointment requests
- Appointment status management
- Contact message submissions
- Contact message management
- MongoDB database operations

**Note:** The free Render service may take some time to respond after periods of inactivity.

### Database — MongoDB Atlas

MongoDB Atlas is used as the cloud database for storing:

- Admin accounts
- Appointment requests
- Contact messages

## Testing

The following functionality was tested during development and deployment:

- Appointment form submission
- Appointment data storage in MongoDB
- Admin login authentication
- Retrieving appointments in the admin dashboard
- Updating appointment status
- Persistence of appointment status after refreshing
- Contact form submission
- Retrieving contact messages in the admin dashboard
- Marking contact messages as read
- Persistence of message status after refreshing
- Communication between the frontend and deployed backend
- Frontend deployment on Vercel
- Backend API deployment on Render

## Challenges and Solutions

### 1. Frontend and Backend Integration

**Challenge:** Connecting frontend forms to backend APIs and ensuring that data is stored correctly.

**Solution:** Used JavaScript Fetch API to communicate with Express REST endpoints and tested form submissions against MongoDB Atlas.

### 2. Admin Authentication

**Challenge:** Restricting appointment and contact message management to administrators.

**Solution:** Implemented JWT-based authentication, bcrypt password hashing, and authentication middleware for protected API routes.

### 3. Cloud Database Connection

**Challenge:** Configuring the backend to connect to MongoDB Atlas in local development and production.

**Solution:** Used Mongoose, environment variables, and MongoDB Atlas network access configuration.

### 4. Separate Frontend and Backend Deployment

**Challenge:** Deploying the frontend and backend on different hosting platforms while maintaining API communication.

**Solution:** Deployed the frontend on Vercel and backend on Render, then configured the frontend API URLs to use the deployed backend.

### 5. Persistent Data Management

**Challenge:** Ensuring appointment and contact message status updates remained saved after refreshing the admin dashboard.

**Solution:** Stored updates in MongoDB through backend API requests rather than maintaining changes only in frontend memory.

## Project Screenshots

### Homepage

![MediCare Homepage](Screenshots/homepage.png)

### Doctors Section

![Doctors Section](Screenshots/doctors.png)

### Appointment Booking

![Appointment Booking](Screenshots/appointment.png)

### Admin Dashboard

![Admin Dashboard](Screenshots/admin-dashboard.png)

### Contact Message Management

![Contact Messages](Screenshots/contact-messages.png)

## Project Status

- [x] Responsive frontend development
- [x] Backend REST API development
- [x] MongoDB Atlas integration
- [x] Appointment booking functionality
- [x] Contact form integration
- [x] Admin authentication with JWT
- [x] Appointment management dashboard
- [x] Contact message management
- [x] Backend deployment on Render
- [x] Frontend deployment on Vercel
- [x] Frontend and backend integration testing
- [x] GitHub repository documentation
- [x] Production testing

**Project Status: Completed and Deployed**

## Future Improvements

- Patient registration and login
- Doctor authentication and dashboards
- Appointment availability and scheduling
- Email notifications for appointment confirmations
- Appointment rescheduling and cancellation by patients
- Improved admin analytics
- Role-based access control for additional user types
- Automated API and frontend testing

## What I Learned

Through this project, I gained practical experience in:

- Building responsive websites using HTML, CSS, and JavaScript
- Developing REST APIs with Node.js and Express.js
- Connecting applications to MongoDB Atlas
- Using Mongoose for database operations
- Implementing JWT authentication
- Securing passwords using bcrypt
- Managing protected backend routes
- Connecting frontend applications to backend services
- Handling form submissions and database updates
- Managing source code using Git and GitHub
- Deploying frontend applications using Vercel
- Deploying backend applications using Render
- Testing and debugging a full-stack application

## Author

Developed as a full-stack web development portfolio project to demonstrate frontend development, backend API integration, database management, authentication, and deployment skills.

## License

No license has been specified for this project.
