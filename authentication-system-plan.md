# Authentication System Plan

## Overview
Create a comprehensive authentication system with role-based access control for the PowerUp Powerlifting application.

## Components to Create

### 1. Landing Page (`src/pages/LandingPage.tsx`)
- Entry point for the application
- Display options to:
  - Login as existing user
  - Create new account
- Role selection for new accounts (athlete, coach, admin)

### 2. Login Page (`src/pages/LoginPage.tsx`)
- Unified login for all user types
- Form fields:
  - Email/Username
  - Password
- Remember me option
- Forgot password link
- Login button
- Link to registration pages

### 3. Registration Pages
#### Athlete Registration (`src/pages/AthleteRegistrationPage.tsx`)
- Form fields specific to athletes:
  - Personal information (name, email, password)
  - Athlete details (age, weight class, division)
  - Emergency contact
  - Waiver agreement

#### Coach Registration (`src/pages/CoachRegistrationPage.tsx`)
- Form fields specific to coaches:
  - Personal information (name, email, password)
  - Coaching credentials
  - Certifications
  - Affiliated organization

#### Admin Registration (`src/pages/AdminRegistrationPage.tsx`)
- Form fields specific to admins:
  - Personal information (name, email, password)
  - Organization details
  - Admin role verification
  - Approval process

### 4. Authentication Context (`src/contexts/AuthContext.tsx`)
- Manage authentication state
- Provide login, logout, and registration functions
- Store user information and role
- Handle session management

### 5. Protected Route Component (`src/components/ProtectedRoute.tsx`)
- HOC for protecting routes based on user role
- Redirect to login if not authenticated
- Redirect to appropriate dashboard based on role

## Routing Structure

### App Routes
- `/` → LandingPage
- `/login` → LoginPage
- `/register/athlete` → AthleteRegistrationPage
- `/register/coach` → CoachRegistrationPage
- `/register/admin` → AdminRegistrationPage

### User Routes (after login)
- `/dashboard` → User dashboard (role-based)
  - Athlete → User dashboard
  - Coach/Admin → Admin dashboard

### Admin Routes (existing)
- `/admin/*` → Admin pages (for coaches and admins)

## Implementation Steps

1. Create LandingPage component
2. Create LoginPage component
3. Create registration pages for each role
4. Implement AuthContext for state management
5. Create ProtectedRoute component
6. Update App.tsx with new routes
7. Implement authentication logic
8. Test the complete flow

## Design Considerations

- Consistent styling with existing components
- Responsive design for all screen sizes
- Form validation and error handling
- Loading states during authentication
- Success/error notifications
- Accessibility features