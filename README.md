
# MediCare — Healthcare Appointment Booking System

MediCare is a full-stack healthcare appointment booking and management system designed to simplify interactions between patients and healthcare providers.

The platform allows patients to explore medical services, browse doctors, request appointments, and contact the healthcare team through a responsive website.

It also includes a secure admin dashboard for managing appointment requests, viewing appointment statistics, and handling contact messages.

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
- Frontend: Vercel (Coming Soon)
- Backend: Render
- Database: MongoDB Atlas
- Version Control: Git & GitHub

## Key Features

### Patient Website
- Responsive healthcare website
- Medical services section
- Doctor listings with search and filtering
- Doctor profile modal
- Appointment booking form
- Contact Us form with MongoDB integration
- Form validation and user feedback

### Admin Dashboard
- Secure admin login with JWT authentication
- Appointment management dashboard
- Appointment statistics
- View appointment details
- Confirm or cancel appointments
- Search and filter appointments
- View contact messages
- Automatically mark unread messages as read
- Persistent appointment and message status updates

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
│   ├── package.json
│   └── .gitignore
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
git clone https://github.com/YOUR-USERNAME/MediCare.git
cd MediCare
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Install Backend Dependencies

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

### 5. Start the Frontend

Open:

`client/index.html`

Launch the file using Live Server in VS Code or Antigravity IDE.

**Note:** The current frontend API URLs point to the deployed Render backend. To use a local backend instead, update the API URLs in:

- `client/js/script.js`
- `client/admin/login.js`
- `client/admin/dashboard.js`

Change the backend hostname to `http://localhost:5000`.

### 6. Access the Admin Dashboard

Open:

`client/admin/login.html`

Sign in using an admin account created through the backend setup process.

Admin credentials are not included in this repository.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate an admin |

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

## Security

MediCare implements several security measures:

- Admin passwords are hashed using bcrypt.
- JWT is used for admin authentication.
- Protected routes require valid authentication tokens.
- Environment variables store sensitive configuration.
- `.env` files are excluded from Git version control.
- Backend validation is used for submitted form data.

## Deployment

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

### Frontend — Vercel

Frontend deployment is in progress.

The frontend will be hosted on Vercel and communicate with the deployed Render backend through REST APIs.

**Live Website:** Coming Soon

### Database — MongoDB Atlas

MongoDB Atlas is used as the cloud database for storing:

- Admin accounts
- Appointment requests
- Contact messages

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
- [x] Frontend and backend integration testing
- [x] GitHub repository documentation
- [ ] Frontend deployment on Vercel
- [ ] Final production testing

## Future Improvements

- Patient registration and login
- Doctor authentication and dashboards
- Appointment availability and scheduling
- Email notifications for appointment confirmations
- Appointment rescheduling and cancellation by patients
- Improved admin analytics

## Author

Developed as a full-stack web development portfolio project to demonstrate frontend development, backend API integration, database management, authentication, and deployment skills.

## License

No license has been specified for this project.
