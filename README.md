# Student Activity Record Management Portal

> **Engineering College Academic & Extracurricular Activity Repository**  
> Based on **E Batch 4 – Project 2 Specification**  
> **100% Pure JavaScript (MERN Stack)** Architecture — Zero TypeScript, Zero Mock Data

---

## 🎓 Overview & Purpose

In modern engineering colleges, students participate in a diverse array of academic, technical, and extracurricular events such as workshops, hackathons, seminars, certifications, internships, sports, and cultural competitions. Maintaining authenticated, verifiable records of these achievements is essential for student portfolios, institutional accreditation (such as NAAC Criterion 3 & 5 and NBA audits), and academic reward points.

The **Student Activity Record Management Portal** is a centralized, full-stack MERN web application where:
1. **Students** securely record and manage their academic and extracurricular achievements with supporting details (event organizer, date, certificate status).
2. **Administrators / Faculty Evaluators** review submitted records, authenticate participation, and either approve or reject them with constructive official remarks.
3. The system maintains a **permanent, auditable activity history** of every student and generates **real-time department-wise analytics** via MongoDB aggregation pipelines.

---

## ⚡ Key Highlights & Strict Architectural Compliance

- **Pure JavaScript Only**: Built entirely using ES6+ JavaScript (`.js` for Node/Express backend and `.jsx` for React frontend). No `.ts` or `.tsx` files, no TypeScript compiler dependencies, and no type interfaces.
- **Unified Port 3000 Deployment**: Express backend and Vite frontend are unified under a single server on port `3000`. Express handles all `/api/*` endpoints while mounting Vite middleware to serve the React application seamlessly.
- **Database Flexibility**: Native Mongoose integration that automatically connects to MongoDB Atlas or provides an immediate in-memory MongoDB fallback with pre-seeded data for evaluation.
- **Strict Role-Based Access Control (RBAC)**: Public registration is locked to the `student` role only. Protected routes and middleware (`authMiddleware`, `roleMiddleware`) enforce strict perimeter boundaries.

---

## 🔑 Demo & Test Credentials

For quick evaluation, the system seeds realistic student and administrator profiles automatically on first boot:

| Role | Name | Email | Password | Department |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Dr. Ramesh Sharma (Dean Academic) | `admin@college.edu` | `Admin@123` | Academic Administration |
| **Student** | Aarav Patel | `aarav.cse@college.edu` | `Password@123` | Computer Science & Engineering |
| **Student** | Priya Sundaram | `priya.it@college.edu` | `Password@123` | Information Technology |
| **Student** | Rohan Deshmukh | `rohan.ece@college.edu` | `Password@123` | Electronics & Communication |
| **Student** | Ananya Sharma | `ananya.mech@college.edu` | `Password@123` | Mechanical Engineering |

*(Quick test credential buttons are also provided directly on the Login page for one-click fill).*

---

## 🚀 Features & Workflows

### 1. Student Portal
- **Dashboard (`/student/dashboard`)**:
  - Live metric summary cards: **Total Activities**, **Pending**, **Approved**, **Rejected**.
  - Recent activity feed with event details and verification status.
  - Direct navigation to add new activities and view all records.
- **Add Activity (`/student/activities/new`)**:
  - Form fields: Activity Title, Category dropdown (Workshop, Seminar, Internship, Certification, Hackathon, Sports, Cultural Event, Technical Competition, Other), Event Name, Organizer, Activity Date, Certificate Status (Available, Not Available, Pending), Description.
  - Submissions enter the system with initial status **Pending**.
- **My Activities (`/student/activities`)**:
  - Filterable table and responsive card view.
  - Filter by category, verification status, and real-time text search.
  - Actions: **View Details**, **Edit Record**, and **Delete Record** with interactive confirmation modal.
- **Activity Details (`/student/activities/:id`)**:
  - Full audit view showing event parameters, student details, and verification outcomes.
  - If **Approved**: displays verified callout, verification timestamp, and evaluating admin name.
  - If **Rejected**: displays official evaluator remarks explaining the rejection reason.

### 2. Administrator Portal
- **Admin Dashboard (`/admin/dashboard`)**:
  - Aggregated metrics: **Total Students**, **Total Activities**, **Pending Verification**, **Approved**, **Rejected**.
  - Pending Verification Quick Queue with direct action buttons.
  - Live **Department-wise Summary Table** (Department, Total Activities, Approved, Pending, Rejected).
- **Activity Verification Workbench (`/admin/verification`)**:
  - Filterable queue displaying only `Pending` submissions.
  - Multi-criteria search: student name, roll number, department, category, or title.
  - Verification Evaluation Modal:
    - **Approve**: sets status to `Approved` with optional verification notes.
    - **Reject**: sets status to `Rejected` with **mandatory explanation remarks**.
  - Live state updates without requiring page reloads.
- **Centralized Activity Repository (`/admin/activities`)**:
  - Complete college-wide activity registry across all departments.
- **Department Analytics & Reports (`/admin/reports`)**:
  - MongoDB aggregation pipeline analytics calculating department performance and approval rates.
  - One-click **Export Department CSV** feature for accreditation reporting.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v4, Lucide React icons.
- **Backend**: Node.js, Express 4, Mongoose 9, JSON Web Token (`jsonwebtoken`), `bcryptjs`, `cors`.
- **Database**: MongoDB (Atlas or In-Memory MongoDB Server fallback).
- **Build / Dev Engine**: Vite 8 with `@vitejs/plugin-react` and `@tailwindcss/vite`.

---

## 📂 Project Architecture

```
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & in-memory fallback
│   ├── controllers/
│   │   ├── activityController.js   # Student activity CRUD operations
│   │   ├── authController.js       # Student registration & JWT authentication
│   │   ├── reportController.js     # MongoDB aggregation pipeline for department stats
│   │   └── verificationController.js # Administrator review, approve/reject endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT bearer token validation
│   │   └── roleMiddleware.js       # Role check (Student vs Admin guard)
│   ├── models/
│   │   ├── Activity.js             # Activity record schema & indexes
│   │   ├── User.js                 # User schema (roles, department, bcrypt hashing)
│   │   └── Verification.js         # Verification audit log schema
│   ├── routes/
│   │   ├── activityRoutes.js       # /api/activities routes
│   │   ├── authRoutes.js           # /api/auth routes
│   │   ├── reportRoutes.js         # /api/reports routes
│   │   └── verificationRoutes.js   # /api/verification routes
│   └── seed/
│       └── adminSeeder.js          # Default college admin and student records seeder
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivityCard.jsx    # Responsive activity card component
│   │   │   ├── ActivityForm.jsx    # Reusable activity submission/edit form
│   │   │   ├── ActivityTable.jsx   # Tabular activity display with actions
│   │   │   ├── ConfirmDialog.jsx   # Deletion confirmation modal
│   │   │   ├── Layout.jsx          # App shell with responsive navigation
│   │   │   ├── LoadingSpinner.jsx  # Academic loading indicators
│   │   │   ├── Navbar.jsx          # Top navigation & user profile chip
│   │   │   ├── ProtectedRoute.jsx  # Authentication route guard
│   │   │   ├── RoleRoute.jsx       # Role-specific route guard (admin-only)
│   │   │   ├── SearchBar.jsx       # Multi-faceted search and filter panel
│   │   │   ├── Sidebar.jsx         # Role-based collapsible sidebar
│   │   │   └── StatusBadge.jsx     # Semantic status tags
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global user authentication state
│   │   ├── pages/
│   │   │   ├── ActivityDetails.jsx # Detailed activity audit page
│   │   │   ├── AddActivity.jsx     # Activity submission page
│   │   │   ├── AdminDashboard.jsx  # Administrator control dashboard
│   │   │   ├── AdminReports.jsx    # Department analytics & CSV export
│   │   │   ├── AllActivities.jsx   # College-wide and accredited records repo
│   │   │   ├── EditActivity.jsx    # Activity update page
│   │   │   ├── Home.jsx            # Academic landing page
│   │   │   ├── Login.jsx           # Sign in page with demo credentials
│   │   │   ├── MyActivities.jsx    # Student personal activity repository
│   │   │   ├── Register.jsx        # Public student registration
│   │   │   └── VerifyActivities.jsx# Verification queue & review modal
│   │   ├── services/
│   │   │   ├── activityService.js  # Activity API client
│   │   │   ├── api.js              # Centralized Axios/Fetch instance with JWT interceptor
│   │   │   ├── authService.js      # Auth API client
│   │   │   └── verificationService.js # Admin verification & report client
│   │   ├── App.jsx                 # Application route tree
│   │   ├── index.css               # Tailwind CSS entry
│   │   └── main.jsx                # React DOM root entry
│   └── package.json
├── server.js                       # Unified Express + Vite development and production server
├── vite.config.js                  # Vite build configuration
├── package.json                    # Project scripts & dependencies
└── metadata.json                   # Application metadata
```

---

## 📡 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student account (public; role forced to `student`).
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/me` — Retrieve current authenticated user profile (`Protected`).

### Student Activities (`/api/activities`)
- `GET /api/activities` — Fetch activities (`student`: own records; `admin`: all records).
- `POST /api/activities` — Create a new activity submission (`Protected`).
- `GET /api/activities/:id` — Retrieve specific activity details with verification history.
- `PUT /api/activities/:id` — Update activity details (`student` owner only; resets status to `Pending`).
- `DELETE /api/activities/:id` — Delete activity record (`student` owner or `admin`).

### Verification & Admin (`/api/verification`)
- `GET /api/verification/pending` — Fetch pending verification queue (`Admin only`).
- `PUT /api/verification/:id` — Approve or Reject activity with remarks (`Admin only`).
- `GET /api/verification/summary` — Fetch portal-wide summary statistics (`Admin only`).
- `GET /api/approvedActivities` — Fetch all approved student records (`Protected`).

### Reports & Analytics (`/api/reports`)
- `GET /api/reports/department-summary` — MongoDB aggregation pipeline returning activity counts grouped by department (CSE, IT, ECE, MECH, etc.) broken down into total, approved, pending, and rejected counts (`Admin only`).

---

## 💻 Running the Project

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server (Port 3000)**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Start Production Server**:
   ```bash
   npm start
   ```

---

*Student Activity Record Management Portal — Built for Engineering College Accreditation Compliance.*
