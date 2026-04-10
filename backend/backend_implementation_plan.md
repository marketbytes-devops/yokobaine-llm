# Backend Implementation Plan - Admin Dashboard

This plan outlines the steps to build the backend infrastructure required to support the Yokobine School Management System's Admin Dashboard.

## 1. Database Schema Expansion

We need to expand the current MySQL schema to encompass all modules viewed in the frontend.

### A. Core Models (`app/schoolapp/models.py`)
- **School**: Core identity of the institution.
  - `id`, `name`, `reg_number`, `principal_name`, `email`, `phone`, `academic_year`, `term_start`, `term_end`, `logo_url`.
- **Classroom**: Academic structure.
  - `id`, `grade`, `section`, `teacher_id` (FK to Users), `capacity`, `room_number`.

### B. Student & Parent Management (`app/studentapp/models.py`)
- **Student**: Enrollment records.
  - `id`, `admission_id` (Unique), `full_name`, `dob`, `blood_group`, `class_id` (FK to Classrooms), `address`, `emergency_contact`.
- **Parent**: Guardian data.
  - `id`, `full_name`, `phone_number` (Unique, used for login), `student_id` (FK to Students).

### B. User Management (`app/authapp/models.py` Updates)
- Update `UserRole` enum to include: `SUPER_ADMIN`, `ADMIN`, `OFFICE_STAFF`, `TEACHER`, `TRANSPORT_MANAGER`.
- Add fields to `User`: `first_name`, `last_name`, `phone_number`.

### C. Communications (`app/notificationapp/models.py`)
- **Notice**: Campus-wide broadcasts.
  - `id`, `title`, `body`, `audience` (JSON/List of roles), `date_created`, `attachment_url`, `sender_id` (FK to Users).

## 2. API Endpoint Definitions

### School Profile (`/api/school`)
- `GET /profile`: Fetch school details.
- `PUT /profile`: Update school settings (SuperAdmin only).
- `POST /logo`: Handle logo upload to storage.

### Academic Structure (`/api/structure`)
- `GET /classes`: List all classes and sections.
- `POST /classes`: Create a new classroom/section setup.
- `DELETE /classes/{id}`: Remove a configuration.

### Student Ledger (`/api/students`)
- `GET /`: Fetch all enrolled students.
- `POST /`: Enroll a new student and associate with a parent.
- `GET /{id}`: Detailed student profile including academic and guardian info.

### User & RBAC (`/api/users`)
- `GET /`: List all users with their roles.
- `POST /invite`: Admin creates a user account and triggers an "Invite" email/notification.
- `PATCH /{id}/status`: Toggle active/suspended status.

### Broadcasts (`/api/notices`)
- `GET /`: Fetch active notices based on user role.
- `POST /`: Create and broadcast a new notice.

## 3. Technology & Security Stack

- **Framework**: FastAPI (Current)
- **Database**: MySQL with SQLAlchemy (Current)
- **Authentication**: JWT-based (Using existing `authapp` infrastructure)
- **Authorization (RBAC)**: 
  - **Permission Scopes**: Mapping roles to modules (e.g., `TEACHER` -> `Attendance`, `OFFICE_STAFF` -> `Ledger`).
  - **FastAPI Dependency**: `RoleChecker` utility to protect endpoints based on user roles.
  - **UI Enforcement**: Hiding/Showing components in the Frontend based on decrypted JWT role payload.
- **Validation**: Pydantic schemas for all request/response bodies.

## 4. Implementation Phases

| Phase | Tasks | Priority |
| :--- | :--- | :--- |
| **Phase 1: Foundation** | Define models and migrate database schema. Update `User` model. | High |
| **Phase 2: School & Structure** | Implement School Profile and Classroom Management endpoints. | High |
| **Phase 3: RBAC & User Ops** | Advanced user management, invitation logic, and role verification. | Medium |
| **Phase 4: Communications** | Noticeboard backend and file upload integration. | Medium |
| **Phase 5: Financials & Reports** | (TBD) Specific endpoints for Ledger and Timetable. | Low |

---

> [!NOTE]
> We will leverage the existing `.env` configuration for secure database and SMTP connectivity.
