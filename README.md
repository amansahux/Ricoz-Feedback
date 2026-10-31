# Recoz Feedback

> A customer feedback and experience platform that helps businesses collect feedback, measure experience, understand customer signals, and act on issues.

## Overview

Recoz Feedback is a full-stack SaaS product built around one simple loop:

**Create survey → Share → Collect responses → Measure → Analyze → Follow up → Resolve**

A business owner creates and publishes feedback surveys. Customers can open a public survey without creating a Recoz account and submit answers through a shareable link, QR code, or embedded website widget. Recoz stores the response, connects each answer to its survey question, calculates NPS/CSAT/CES where applicable, performs response analysis, and surfaces the result in the business dashboard, feedback inbox, customer history, and analytics views.

The project is intentionally organized as a modular MERN application with a layered Express backend and a feature-based React frontend.

---

## Core Product Flow


```text
Core Product Flow

Visitor
  │
  ▼
Landing Page
  │
  ├── Create workspace ──► Register
  │                          │
  │                          ├── Create User
  │                          ├── Create Organization
  │                          └── Issue JWT
  │                               │
  └── Sign in ──► Login ──────────┘
                              │
                              ▼
                    HTTP-only Auth Cookie
                              │
                              ▼
                    Dashboard / Overview
                              │
                              ▼
                       Create Survey
                              │
                              ▼
                       Survey Builder
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
               Save Draft          Publish Survey
                                        │
                                        ▼
                                  Share Survey
                                  │    │    │
                                  │    │    └── Website Widget
                                  │    └─────── QR Code
                                  └──────────── Public Link
                                  │
                                  ▼
                         Public Feedback Page
                                  │
                                  ▼
                         Customer Answers
                                  │
                                  ▼
                           Submit Response
                              │       │
                     ┌────────┘       └────────┐
                     ▼                         ▼
              Create / Reuse              Store Response
                Customer                        │
                                               ├── Calculate NPS
                                               ├── Calculate CSAT
                                               ├── Calculate CES
                                               └── Sentiment + Topic Analysis
                                                        │
                                                        ▼
                                                  Feedback Inbox
                                                        │
                                                        ▼
                                                  Feedback Detail
                                                        │
                                     Open → In Progress → Follow-up Note → Resolved
                                                        │
                                     ┌──────────────────┴──────────────────┐
                                     ▼                                     ▼
                               Customer History                        Analytics
```

---

## Product Areas

| Area | Purpose |
|---|---|
| Landing | Public product introduction and entry point into Recoz |
| Authentication | Register, login, email verification, Google OAuth, refresh tokens, password recovery |
| Dashboard | Fast overview of feedback volume and customer experience metrics |
| Surveys | Create, edit, delete, publish, and share surveys |
| Public Survey | Customer-facing dynamic feedback form |
| Feedback | Search, filter, inspect, update, and resolve customer feedback |
| Customers | View people who submitted feedback and their feedback history |
| Analytics | NPS, CSAT, CES, response volume, topics, and sentiment trends |
| Team Management | Organization member directory, role assignment, and email invitation workflow |
| Settings | Profile, organization, branding, and account security |

---

# Tech Stack

## Frontend

- React
- Vite
- JavaScript
- React Router
- TanStack Query
- Redux Toolkit
- Axios
- Tailwind CSS
- Recharts
- Lucide React

## Backend

- Node.js
- Express.js
- JavaScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- Passport.js / Google OAuth
- Email service layer (Resend / Brevo / Nodemailer transport)
- Zod-style request validation through project validators

## Architecture

- REST API
- Feature-based React frontend
- Layered Express backend
- Organization-scoped data access
- JWT authentication with cookies
- Server state handled by TanStack Query
- Lightweight global client state handled by Redux Toolkit

---

# Repository Structure

```text
Recoz-Feedback/
│
├── backend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── cookie.js
│   │   │   ├── db.js
│   │   │   ├── env.js
│   │   │   ├── passport.js
│   │   │   └── roles.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── analytics.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── customer.controller.js
│   │   │   ├── response.controller.js
│   │   │   ├── survey.controller.js
│   │   │   └── team.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── customer.model.js
│   │   │   ├── organization.model.js
│   │   │   ├── organizationInvitation.model.js
│   │   │   ├── organizationMember.model.js
│   │   │   ├── question.schema.js
│   │   │   ├── response.model.js
│   │   │   ├── survey.model.js
│   │   │   └── user.models.js
│   │   │
│   │   ├── routes/
│   │   │   ├── analytics.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── customer.routes.js
│   │   │   ├── invitation.routes.js
│   │   │   ├── response.routes.js
│   │   │   ├── survey.routes.js
│   │   │   └── team.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── analytics.service.js
│   │   │   ├── auth.service.js
│   │   │   ├── customer.service.js
│   │   │   ├── email.service.js
│   │   │   ├── response.service.js
│   │   │   ├── sentiment.service.js
│   │   │   ├── survey.service.js
│   │   │   └── team.service.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── calculateMetrics.js
│   │   │   ├── generateSlug.js
│   │   │   └── generateToken.js
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── response.validator.js
│   │   │   ├── survey.validator.js
│   │   │   └── team.validator.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── config/
│   │   └── axiosInstance.jsx
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── PublicLayout.jsx
│   │   │   │   └── RootLayout.jsx
│   │   │   ├── routes/
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── routes.jsx
│   │   │   └── store.jsx
│   │   │
│   │   ├── features/
│   │   │   ├── Landing/
│   │   │   ├── analytics/
│   │   │   ├── auth/
│   │   │   ├── customers/
│   │   │   ├── dashboard/
│   │   │   ├── feedback/
│   │   │   ├── setting/
│   │   │   ├── surveys/
│   │   │   └── team/
│   │   │
│   │   ├── global/
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── Card.jsx
│   │   │
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

> The structure above follows the supplied repository screenshots and the current route/controller/service layout. Folder internals not shown in the screenshots are intentionally kept at the level supported by the provided structure.

---

# Backend Architecture

Recoz uses a layered Express architecture:


```text
Backend Request Flow

HTTP Request
    │
    ▼
  Route
    │
    ▼
Middleware
    │
    ▼
Controller
    │
    ▼
Service
    │
    ├── Utility / Helper
    └── Email / Analysis Service
    │
    ▼
Mongoose Model
    │
    ▼
MongoDB
    │
    ▼
HTTP Response
```

### Responsibilities

**Routes**
- Define HTTP methods and endpoint paths
- Attach authentication and validation middleware
- Keep endpoint wiring thin

**Middleware**
- Authenticate requests
- Validate request payloads
- Centralize error handling

**Controllers**
- Read request data
- Call the correct service
- Return a consistent response
- Avoid embedding heavy business logic

**Services**
- Contain business rules
- Orchestrate database operations
- Calculate experience metrics
- Handle survey and response workflows
- Process authentication and email flows

**Models**
- Define MongoDB schemas
- Store application data
- Provide the persistence boundary for services

---

# Data Model

Recoz keeps the MVP data model compact.


```text
Data Relationships

Organization
├── Users
├── OrganizationMembers (RBAC & Status)
├── OrganizationInvitations (Token Hash, Expiry & Role)
├── Surveys
├── Customers
└── Responses

Survey
└── Responses

Customer
└── Responses

User
└── belongs to Organization via OrganizationMember (role: owner | admin | support_agent)

OrganizationInvitation
├── belongs to Organization
└── tracks invited email, role, tokenHash, status, and expiresAt

Response
├── belongs to Organization
├── belongs to Survey
└── belongs to Customer
```

## Survey Question Mapping

Questions are embedded inside a survey. Each question has its own identifier.

```text
Survey
│
└── questions[]
      ├── _id: q1
      ├── _id: q2
      └── _id: q3

Response
│
└── answers[]
      ├── questionId: q1 → value: 4
      ├── questionId: q2 → value: 8
      └── questionId: q3 → value: "Delivery was slow"
```

This lets the response preserve a stable relationship between each answer and the exact survey question that produced it.

---

# Authentication & Account Flow


```text
Authentication & Account Flow

Register
  │
  ▼
Validate Input
  │
  ▼
Check Email
  │
  ▼
Create Organization
  │
  ▼
Create User
  │
  ▼
Hash Password
  │
  ▼
Issue Tokens
  │
  ▼
Set HTTP-only Cookie
  │
  ▼
Dashboard
  │
  ▼
GET /auth/me
  │
  ▼
Protected Application

Login
  └──► Validate Credentials ──► Issue Tokens ──► HTTP-only Cookie

Google OAuth
  └──► Passport ──► OAuth Callback ──► Issue Tokens

Email Verification
  └──► Verification Token ──► Activate Account

Forgot Password
  └──► Send OTP ──► Verify OTP ──► Reset Password

Refresh Token
  └──► Issue new access token / refresh flow

Logout
  └──► Clear / Invalidate Auth Cookie
```

### Authentication capabilities

- Registration
- Email/password login
- Email verification
- Resend verification
- Forgot-password OTP
- Resend OTP
- Invalidate OTP
- Verify OTP
- Reset password
- JWT refresh
- Google OAuth
- Current-user lookup
- Logout
- Profile update
- Authenticated password change

---

# Frontend Routing & Access


```text
Frontend Routing & Access

PUBLIC
│
├── /                         → Landing Page
├── /login                    → Login
├── /register                 → Register
├── /verify-email             → Email Verification
├── /forgot-password          → Password Recovery
├── /invitations/:token       → Accept Team Invitation
│
└── /f/:organizationSlug/:surveySlug
    → Public Customer Survey
    → Submit Response

AUTHENTICATION CHECK
│
├── Authenticated
│   └── /dashboard
│       └── AppLayout (Role-Guarded via PermissionRoute)
│           ├── /surveys               [owner, admin]
│           ├── /surveys/create        [owner, admin]
│           ├── /surveys/publish       [owner, admin]
│           ├── /feedback              [all roles]
│           │   └── /feedback/:feedbackId
│           ├── /customers             [all roles]
│           │   └── /customers/:customerId
│           ├── /analytics             [owner]
│           ├── /team                  [owner only]
│           │   └── /team/:memberId    [owner only]
│           └── /settings              [all roles]
│
└── Not Authenticated
    └── Stay on Public Route
        └── Login / Register / Accept Invitation
```

## Route categories

### Public application routes

```text
/
/login
/register
/verify-email
/forgot-password
/invitations/:token
/f/:organizationSlug/:surveySlug
```

### Protected application routes

```text
/dashboard
/surveys
/surveys/create
/surveys/publish
/feedback
/feedback/:feedbackId
/customers
/customers/:customerId
/analytics
/team
/team/:memberId
/settings
```

`ProtectedRoute` wraps the authenticated application layout and ensures a valid session, while `PermissionRoute` enforces role-based access control (RBAC) per page.

---

# Page-by-Page Product Flow

## 1. Landing Page `/`

The public marketing front door of Recoz.

Purpose:
- Explain the product
- Show the collect → understand → act workflow
- Direct visitors to registration or login

Primary actions:
- Create workspace → `/register`
- Sign in → `/login`

---

## 2. Register `/register`

A single registration creates the business owner account and organization.

```text
Name
Organization name
Email
Password
        ↓
Create workspace
        ↓
User + Organization
        ↓
JWT Cookie
        ↓
Dashboard
```

No separate organization-creation screen is required for the current MVP flow.

---

## 3. Login `/login`

Business owner enters email and password.

Successful authentication:

```text
Credentials
   ↓
Passport / Auth Service
   ↓
JWT
   ↓
HTTP-only Cookie
   ↓
Dashboard
```

Google OAuth is also supported through Passport.

---

## 4. Verify Email `/verify-email`

Used after registration or when a verification email is issued.

Capabilities exposed by the backend:

- verify email token
- resend verification

---

## 5. Forgot Password `/forgot-password`

Password-recovery flow:

```text
Enter email
   ↓
Send OTP
   ↓
Verify OTP
   ↓
Set new password
   ↓
Return to login
```

The backend exposes separate endpoints for OTP send, resend, invalidation, verification, and password reset.

---

## 6. Dashboard `/dashboard`

The dashboard is the **Overview** page.

It gives a quick snapshot of:

- total responses
- NPS
- CSAT
- CES
- response volume
- sentiment mix
- top topics
- recent feedback

The dashboard is intentionally a snapshot, while `/analytics` is the deeper analytical view.

---

## 7. Surveys `/surveys`

Business owner can:

- view surveys
- create surveys
- edit surveys
- delete surveys
- publish surveys
- open sharing flow

Survey lifecycle:

```text
Draft
  ↓
Edit
  ↓
Publish
  ↓
Live
  ↓
Collect responses
```

---

## 8. Survey Builder `/surveys/create`

Dynamic survey creation workspace.

Typical question types supported by the product include:

- Rating
- NPS
- CSAT
- CES
- Short text
- Long text
- Multiple choice
- Yes / No

Every question carries its own ID so submitted answers can reference `questionId`.

---

## 9. Publish / Share `/surveys/publish`

After publishing a survey, the business can distribute it through:

### Link

A public URL customers can open directly.

### QR Code

The same public survey URL encoded into a QR code.

### Widget

A website embed that opens the same public survey experience.


```text
Share Channels

Published Survey
      │
      ▼
   Public URL
   ├── Direct Link ─────┐
   ├── QR Code ─────────┤
   └── Website Widget ──┤
                        ▼
                Same Public Survey
                        │
                        ▼
                  Submit Response
```

The important design choice is that **all three channels reuse the same dynamic public survey page** instead of creating separate survey implementations.

---

## 10. Public Survey `/f/:organizationSlug/:surveySlug`

This is the customer-facing page.

The page receives the organization and survey from URL parameters.

```text
URL params
   ↓
organizationSlug
surveySlug
   ↓
Fetch published survey
   ↓
Render survey.questions[]
   ↓
Customer answers
   ↓
Submit response
```

Customers do not need to create Recoz accounts.

### Dynamic question rendering


```text
Dynamic Question Rendering

Question Object
      │
      ▼
 question.type
      │
      ├── rating          → 1–5 Rating
      ├── nps             → 0–10 NPS
      ├── csat            → 1–5 CSAT
      ├── ces             → 1–7 CES
      ├── text            → Short Text
      ├── textarea        → Long Text
      ├── multiple-choice → Options
      └── yes-no          → Yes / No
```

---

## 11. Team Management `/team` & `/team/:memberId`

The organization control center for team collaboration and workforce management (Owner only).

```text
Team Management Flow

Owner Dashboard
      │
      ▼
/team (Members & Pending Directory)
      ├── Invite Member Modal ──► POST /api/team/invitations
      │                             │
      │                             ├── Issue Secure Token (SHA-256 hashed)
      │                             └── Send Invitation Email
      │
      ├── Manage Roles ──────────► PATCH /api/team/members/:id/role
      ├── Deactivate / Reactivate ─► PATCH /api/team/members/:id/status
      └── Remove Member ─────────► DELETE /api/team/members/:id
```

Purpose & Capabilities:
- Organization-wide member directory with search, role filters, status filters, and pagination.
- Operational metrics: total members, active operators, pending invites, and seat utilization percentage.
- Sending role-scoped invitations (`admin` or `support_agent`) via email.
- Managing pending invitations (tracking sent date, expiration, and status).
- Viewing granular member profiles, activity history, and operational feedback workloads (`/team/:memberId`).
- Changing roles, toggling active/inactive status, or revoking team membership.
- Exporting the team member directory as CSV.

---

## 12. Accept Invitation `/invitations/:token`

The onboarding gateway for new and existing employees to join an organization.

```text
Invitation Acceptance Flow

Employee opens secure invitation link from email
                       │
                       ▼
            GET /api/invitations/:token
       (Validates token hash, status, & expiry)
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       Existing User         New User
             │                   │
      Account detected    Enter name & password
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
          POST /api/invitations/:token/accept
                       │
        ├── Auto-verify email
        ├── Create/Activate OrganizationMember
        ├── Assign specified Role (Admin / Support Agent)
        ├── Mark invitation as Accepted
        └── Issue JWT tokens in HTTP-only cookies
                       │
                       ▼
             Redirect to Dashboard / Allowed Feature
```

Key features:
- Secure token lookup using SHA-256 hash matching and 24-hour expiration checks.
- Smooth dual-path onboarding: seamlessly connects existing users or provisions new accounts with automatic email verification.
- Enforces single active organization membership and locks the assigned role immediately upon acceptance.

---

# Response Submission Flow

This is the core product transaction.


```text
Response Submission Flow

Customer
   │
   ▼
React Public Survey
   │
   ▼
POST Public Survey Response
   │
   ▼
Response Service
   │
   ├── Validate response
   ├── Find / create customer
   ├── Save response
   ├── Calculate NPS / CSAT / CES
   └── Run sentiment / topic analysis
   │
   ▼
MongoDB
   │
   ▼
Response accepted
   │
   ▼
Thank-you state
```

### Submitted answer shape

```json
{
  "customer": {
    "name": "Customer Name",
    "email": "customer@example.com"
  },
  "answers": [
    {
      "questionId": "question-id-1",
      "value": 5
    },
    {
      "questionId": "question-id-2",
      "value": 9
    },
    {
      "questionId": "question-id-3",
      "value": "Great product, but delivery was slow."
    }
  ]
}
```

---

# Experience Metrics

Recoz calculates metrics from submitted responses.

## CSAT

Measures satisfaction with the experience.

Typical representation:

```text
★★★★★
4 / 5
```

Satisfied responses are used to calculate the percentage score.

## NPS

Customer selects a score from 0–10.

```text
0–6   → Detractors
7–8   → Passives
9–10  → Promoters
```

Formula:

```text
NPS = Promoter % - Detractor %
```

## CES

**Customer Effort Score** measures how easy or difficult it was for the customer to complete a task or resolve an issue.

Example:

```text
1  2  3  4  5  6  7
Very difficult → Very easy
```

A customer selecting `6` can be displayed as:

```text
CUSTOMER EFFORT
6 / 7
```

---

# Feedback Inbox `/feedback`

The inbox converts raw responses into an operational queue.

Features:

- search by customer, email, text, or topic
- status filter
- sentiment filter
- source filter
- rating filter
- sorting
- pagination
- open feedback detail

Typical flow:

```text
All feedback
   ↓
Search / filter
   ↓
Open response
   ↓
Review answers
   ↓
Take action
```

---

# Feedback Detail `/feedback/:feedbackId`

Shows one response in full.

Includes:

- customer information
- NPS score
- CSAT score
- CES score
- submitted answers
- sentiment
- detected topics
- source
- status
- follow-up note

## Close-the-loop workflow


```text
Feedback Lifecycle

OPEN
  │
  ▼
IN PROGRESS
  │
  ▼
RESOLVED
  │
  └── can be moved back to IN PROGRESS
```

The owner can:

- move status to `In Progress`
- add an internal follow-up note
- mark feedback as `Resolved`

This gives Recoz an operational loop instead of stopping at data collection.

---

# Customers `/customers`

Lists people who have submitted feedback.

Typical fields:

- name
- email
- feedback count
- average rating
- last feedback date

Clicking a customer opens the detail page.

---

# Customer Detail `/customers/:customerId`

Provides customer-level context:

- customer identity
- number of feedback responses
- average rating
- first/creation date
- feedback history


```text
Customer Navigation

Customer List
     │
     ▼
Customer Detail
     │
     ▼
Feedback History
     │
     ▼
Feedback Detail
```

This connects a customer's historical responses back into the main feedback workflow.

---

# Analytics `/analytics`

The Analytics page turns stored responses into trends.

Main areas:

- total responses
- NPS
- CSAT
- CES
- response volume
- NPS breakdown
- top topics
- sentiment distribution
- selected time range

Supported ranges in the current UI design:

```text
7d
30d
90d
```

The analytics layer is intended to aggregate real response data rather than relying on hardcoded dashboard values.

---

# Analytics Data Flow


```text
Analytics Data Flow

Responses
    │
    ▼
Analytics Service
    │
    ├── Total Responses
    ├── NPS
    ├── CSAT
    ├── CES
    ├── Response Volume
    ├── NPS Breakdown
    ├── Top Topics
    └── Sentiment Distribution
         │
         ├── Dashboard
         └── Analytics
```

---

# Response Analysis

Recoz stores response-level analysis fields such as:

```text
sentiment
topics
```

A typical analysis pipeline is:

```text
Text answer
   ↓
Sentiment service
   ↓
positive / neutral / negative

Text answer
   ↓
Topic detection
   ↓
Delivery / Support / Product / Checkout / etc.
```

The current backend also has a dedicated `sentiment.service.js`, keeping analysis logic outside the controller layer.

This separation leaves room for swapping or extending the analysis implementation later without changing the response workflow.

---

# Team Management & Role-Based Access Control (RBAC)

Recoz Feedback includes an enterprise-grade Team Management and Role-Based Access Control (RBAC) architecture designed for organization-scoped multi-tenant operations. Organization owners can build and manage teams with fine-grained access boundaries, keeping sensitive administrative dashboards and settings protected while empowering support agents to handle day-to-day customer issues.

```text
Team Management & RBAC Architecture

                      ┌──────────────────────────────────────┐
                      │          Organization Owner          │
                      │  (Full control, invites & team CRUD) │
                      └──────────────────┬───────────────────┘
                                         │
                        Sends Secure Email Invitation
                        (Token SHA-256 Hashed, 24h Expiry)
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
      ┌───────────────────────────┐             ┌───────────────────────────┐
      │           Admin           │             │       Support Agent       │
      │   Full Operational Access │             │    Restricted Feedback    │
      │   (No Team Management)    │             │      & Customer Queue     │
      └───────────────────────────┘             └───────────────────────────┘
```

---

## 1. Role Hierarchy & Permissions

Recoz defines three distinct access tiers. Permissions are verified on the backend via Express middleware (`authMiddleware`, `requireRole`, `requirePermission`) and enforced on the frontend with route-level guards (`PermissionRoute`).

- **Owner:** Full organization access. The creator of the organization holds permanent ownership rights. **Only the owner** can invite employees to join their organization by sending email invitations, change member roles, deactivate members, or remove members.
- **Admin:** Full access to Dashboard, Analytics overview, Surveys (create, edit, publish, view), Feedback, and Customers, but **strictly no access to the Team Management page** or member administration endpoints.
- **Support Agent:** Operational triage access limited to **Feedback and Customers only**. Support agents cannot access Dashboard, Analytics, Surveys, or Team Management.

### Role Permission Matrix

| Feature / Resource | Permission Key | Owner | Admin | Support Agent |
|---|---|:---:|:---:|:---:|
| **Dashboard** | `dashboard.view` | ✅ Full Access | ✅ Full Access | ❌ No Access |
| **Analytics Overview** | `analytics.view` | ✅ Full Access | ✅ Full Access | ❌ No Access |
| **Analytics Deep Trends** | `analytics.trends` | ✅ Full Access | ❌ Restricted | ❌ No Access |
| **Survey Creation & Editing** | `survey.create`, `survey.update` | ✅ Full Access | ✅ Full Access | ❌ No Access |
| **Survey Publishing** | `survey.publish` | ✅ Full Access | ✅ Full Access | ❌ No Access |
| **Survey Deletion** | `survey.delete` | ✅ Full Access | ❌ Restricted | ❌ No Access |
| **Survey List & View** | `survey.view` | ✅ Full Access | ✅ Full Access | ❌ No Access |
| **Feedback Inbox & Detail** | `feedback.view` | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| **Feedback Status & Notes** | `feedback.update`, `feedback.resolve` | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| **Customers Directory & History** | `customer.view`, `customer.reply` | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| **Team Management Page (`/team`)** | `team.view` | ✅ Full Access | ❌ No Access | ❌ No Access |
| **Invite Team Members** | `team.invite` | ✅ Full Access | ❌ No Access | ❌ No Access |
| **Modify Member Roles & Status** | `team.update_role`, `team.deactivate` | ✅ Full Access | ❌ No Access | ❌ No Access |
| **Remove Team Members** | `team.remove` | ✅ Full Access | ❌ No Access | ❌ No Access |
| **Settings & Profile** | `organization.settings` | ✅ Full Access | ✅ Full Access | ✅ Profile Only |

---

## 2. Organization Membership Model

Team memberships are decoupled from user credentials through dedicated multi-tenant domain models:

1. **User (`User`):** Stores identity credentials (name, email, hashed password, verification status). A user can belong to an organization and operate with their assigned role.
2. **Organization Member (`OrganizationMember`):** Binds a `userId` to an `organizationId` with an explicit `role` (`owner`, `admin`, `support_agent`), membership `status` (`active`, `inactive`), and `joinedAt` timestamp.
3. **Organization Invitation (`OrganizationInvitation`):** Stores pending invitations with target `email`, assigned `role`, cryptographically hashed verification token (`tokenHash`), `invitedBy` user reference, `status` (`pending`, `accepted`, `expired`, `cancelled`), and `expiresAt` expiration date.

### Membership Invariants & Safety Rules

- **Unique Active Membership:** An email can only have one active membership per organization.
- **Owner Immutability:** An owner's role cannot be downgraded or altered via team member endpoints, preventing accidental lockout.
- **Self-Action Prevention:** An owner cannot demote, deactivate, or delete their own active account from the team interface.
- **Deactivation Handling:** Deactivating a member changes their status to `inactive`. The authentication middleware immediately blocks inactive members on their next API request with a `403 Forbidden` status.

---

## 3. Invitation Workflow

The invitation lifecycle ensures secure, verifiable team onboarding with zero password exposure:

```text
Step-by-Step Invitation Flow

  [Owner Action]
        │
        ├── 1. Enters employee's email and selects role ('Admin' or 'Support Agent')
        ├── 2. Backend generates cryptographically secure 32-byte hex token
        ├── 3. SHA-256 hash stored in DB with 24-hour expiration window
        └── 4. HTML invitation email dispatched with secure link:
               https://<app-domain>/invitations/<rawToken>
        │
  [Employee Action]
        │
        ├── 5. Employee clicks secure link in invitation email
        ├── 6. Frontend loads /invitations/:token and validates token status
        │
        ├── 7. Authentication / Account Option:
        │        ├── Existing Account: Signs in or links directly
        │        └── New Account: Enters full name and password
        │
        └── 8. Submits acceptance:
                 POST /api/invitations/:token/accept
        │
  [System Result]
        │
        ├── Automatically marks user email as verified
        ├── Creates or activates OrganizationMember record with assigned role
        ├── Transitions invitation status from 'pending' to 'accepted'
        ├── Issues secure HTTP-only access & refresh JWT tokens
        └── Redirects employee to authorized workspace features
```

### Detailed Steps:

1. **Owner sends invite:** The organization owner opens the Team Management screen (`/team`), clicks **Invite member**, inputs the employee's corporate email, and selects their target role (`Admin` or `Support Agent`).
2. **Secure token creation & email delivery:** The backend creates an `OrganizationInvitation` document storing a one-way `SHA-256` hash of a 32-byte random hex token. A transactional invitation email is delivered to the recipient containing the secure URL (`/invitations/:token`).
3. **Dual-path onboarding:**
   - **Existing users:** If an account already exists with the invited email, the user can immediately confirm and join the organization.
   - **New users:** New team members can complete registration right on the acceptance page by providing their name and password without a separate sign-up hoop.
4. **Acceptance & auto-activation:** Upon submission to `/api/invitations/:token/accept`, the backend validates token validity and expiration. It automatically marks the user account as verified, creates the active `OrganizationMember` binding with the designated role, marks the invitation as accepted, and issues HTTP-only authentication tokens.
5. **Role-governed workspace:** The employee lands in the app with their view and API access automatically tailored to their role.

---

## 4. Security & Access Control Enforcement

Recoz employs defense-in-depth security principles across frontend routing and backend middleware:

- **Cryptographic Invitation Tokens:** Raw tokens are never stored in plaintext in MongoDB. Only the one-way `SHA-256` hash is persisted, preventing token compromise even in the event of database inspection.
- **Strict Expiration Windows:** Invitations automatically expire after 24 hours. Expired or cancelled tokens are immediately rejected.
- **Double-Layer Authorization:**
  - **Backend Layer (Express):** Endpoints are protected by `authMiddleware` which resolves the user's active membership in the organization. Sensitive routes use `requireRole([ROLES.OWNER])` or `requirePermission(...)` to block unauthorized requests at the controller boundary.
  - **Frontend Layer (React Router):** `PermissionRoute` inspects the authenticated user's role in client state and blocks unauthorized navigation, while UI navigation elements dynamically hide links to unauthorized pages (e.g., hiding Team Management from Admins and Support Agents).
- **Tenant Isolation:** Every member operation and team listing query strictly scopes database operations to `req.user.organizationId`, ensuring no cross-organization data leakage.

---

# REST API

> Endpoint mount prefixes depend on `app.js`. The endpoint map below follows the current route definitions and the product's API naming convention.

## Authentication

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Create user + organization | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/verify-email` | Verify account email | Public |
| GET | `/api/auth/verify-email` | Verify account email through link | Public |
| POST | `/api/auth/resend-verification` | Resend verification | Public |
| POST | `/api/auth/forgot-password` | Start OTP password recovery | Public |
| POST | `/api/auth/resend-otp` | Resend reset OTP | Public |
| POST | `/api/auth/invalidate-otp` | Invalidate active OTP | Public |
| POST | `/api/auth/verify-otp` | Verify reset OTP | Public |
| POST | `/api/auth/reset-password` | Set new password | Public |
| POST | `/api/auth/refresh-token` | Refresh authentication token | Public/Token flow |
| POST | `/api/auth/refresh` | Alias for refresh | Public/Token flow |
| GET | `/api/auth/google` | Start Google OAuth | Public |
| GET | `/api/auth/google/callback` | Google OAuth callback | Public |
| GET | `/api/auth/me` | Get current user | Protected |
| POST | `/api/auth/logout` | Logout | Protected |
| PATCH | `/api/auth/update-profile` | Update profile | Protected |
| PATCH | `/api/auth/change-password` | Change current password | Protected |

## Surveys

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/surveys/public/:organizationSlug/:surveySlug` | Load public survey | Public |
| POST | `/api/surveys` | Create survey | Protected |
| GET | `/api/surveys` | List surveys | Protected |
| GET | `/api/surveys/:id` | Get survey | Protected |
| PATCH | `/api/surveys/:id` | Update survey | Protected |
| DELETE | `/api/surveys/:id` | Delete survey | Protected |
| POST | `/api/surveys/:id/publish` | Publish survey | Protected |

## Responses / Feedback

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/public/surveys/:organizationSlug/:surveySlug` | Submit public survey response | Public |
| GET | `/api/responses` | Get responses | Protected |
| GET | `/api/responses/:id` | Get one response | Protected |
| PATCH | `/api/responses/:id` | Update response status | Protected |

> The current response router defines the public path as `/public/surveys/:organizationSlug/:surveySlug`. The final prefix is determined by where `response.routes.js` is mounted in `app.js`.

## Customers

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/customers` | List customers | Protected |
| GET | `/api/customers/:customerId` | Get customer details/history | Protected |

## Analytics

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/analytics/overview` | Dashboard analytics overview | Protected (Owner, Admin) |
| GET | `/api/analytics/trends` | Trend-oriented analytics | Protected (Owner only) |

## Team Management (Owner Only)

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/team/invitations` | Send role invitation email to employee | Protected (Owner only) |
| GET | `/api/team/members` | List organization team members and pending invites | Protected (Owner only) |
| GET | `/api/team/members/:memberId` | Get individual member details & feedback activity | Protected (Owner only) |
| PATCH | `/api/team/members/:memberId/role` | Update member role (`admin` or `support_agent`) | Protected (Owner only) |
| PATCH | `/api/team/members/:memberId/status` | Toggle member status (`active` or `inactive`) | Protected (Owner only) |
| DELETE | `/api/team/members/:memberId` | Remove member from organization | Protected (Owner only) |

## Invitations (Public / Employee Onboarding)

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/invitations/:token` | Validate invitation token & retrieve org details | Public (Valid token required) |
| POST | `/api/invitations/:token/accept` | Accept invitation & provision/bind account | Public (Valid token required) |

---

# Frontend Route Map

The current React Router configuration defines these routes:

```text
PUBLIC
│
├── /
├── /login
├── /register
├── /verify-email
├── /forgot-password
├── /invitations/:token
└── /f/:organizationSlug/:surveySlug

PROTECTED (Subject to Role Permissions)
│
├── /dashboard              [owner, admin]
├── /surveys                [owner, admin]
├── /surveys/create         [owner, admin]
├── /surveys/publish        [owner, admin]
├── /feedback               [owner, admin, support_agent]
├── /feedback/:feedbackId   [owner, admin, support_agent]
├── /customers              [owner, admin, support_agent]
├── /customers/:customerId  [owner, admin, support_agent]
├── /analytics              [owner]
├── /team                   [owner only]
├── /team/:memberId         [owner only]
└── /settings               [owner, admin, support_agent]
```

A catch-all route renders the `NotFound` page.

---

# Frontend Feature Architecture

The frontend follows a feature-oriented structure rather than placing all application logic under generic components.


```text
Frontend Feature Architecture

src/
├── app/
│   ├── layout/
│   ├── routes/
│   └── store
│
├── features/
│   ├── Landing
│   ├── auth
│   ├── surveys
│   ├── feedback
│   ├── customers
│   ├── dashboard
│   ├── analytics
│   ├── setting
│   └── team
│
├── global/
│   └── NotFound
│
└── shared/
    ├── components
    ├── hooks
    └── shared UI

Feature modules keep API code, hooks, state, and UI concerns close to the feature they serve.
```

### State responsibilities

```text
TanStack Query
    ↓
Server state
- user
- surveys
- responses
- customers
- analytics
- organization

Redux Toolkit
    ↓
Client/global state
- UI preferences
- global interface state

React local state
    ↓
Local form and component state
- survey builder input
- OTP fields
- modal visibility
- temporary form values
```

---

# Protected Request Flow


```text
Protected Request Flow

React App
    │
    ▼
Axios
    │
    ▼
Auth Middleware & RBAC Guard
    │
    ├── Read JWT from HTTP-only cookie
    ├── Verify token signature & expiry
    ├── Query OrganizationMember for active membership & role
    ├── Reject if member inactive / revoked
    ├── Populate req.user (userId, organizationId, role, permissions)
    └── Check requireRole / requirePermission (if route protected)
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
MongoDB
    │
    ▼
Controller
    │
    ▼
JSON Response
    │
    ▼
TanStack Query updates / invalidates server state
```

---

# Organization Isolation

Every business-owned resource is scoped to the authenticated user's organization.

The important security boundary is:

```text
JWT
 ↓
req.user.organizationId
 ↓
Database query
 ↓
Only that organization's data
```

Private queries should use the authenticated organization ID instead of trusting an `organizationId` supplied by the browser.

Example conceptual filter:

```js
{
  organizationId: req.user.organizationId
}
```

This applies to:

- surveys
- responses
- customers
- analytics
- organization settings

A resource ID alone must not be enough to access another organization's data.

---

# Share Channels

Recoz treats link, QR, and widget as distribution mechanisms for one survey.


```text
Share Channel Architecture

Survey
  │
  ▼
Public URL
  ├── Direct Link
  ├── QR Code
  └── Widget
       │
       ▼
Same Public Survey Page
       │
       ▼
Same Response API
```

This keeps the product maintainable because there is only one customer-facing survey rendering system.

---

# Widget Concept

The website widget is a lightweight embed that points back to the public survey experience.

Conceptually:

```text
Business Website
      ↓
Recoz widget.js
      ↓
Feedback trigger
      ↓
Modal / iframe
      ↓
Public survey URL
      ↓
Customer submits
      ↓
Public response endpoint
```

The widget should reuse the public survey rather than duplicating survey question logic.

---

# QR Concept

The QR code is simply another representation of the same public survey URL.

```text
Published Survey
      ↓
https://domain/f/organization/survey
      ↓
QR Generator
      ↓
PNG / SVG QR
      ↓
Customer scans
      ↓
Public Survey Page
```

This means no separate QR-specific backend survey system is necessary.

---

# Survey Lifecycle


```text
Survey Lifecycle

DRAFT
  │
  ▼
PUBLISHED
  │
  └── Edit / republish flow

Published surveys are exposed through the public survey route.
Deletion semantics depend on the current survey service implementation.
```

The exact deletion semantics are controlled by the current survey service implementation. Existing responses should be treated carefully when changing survey state because responses reference the survey.

---

# Feedback Lifecycle

```text
OPEN
  ↓
IN PROGRESS
  ↓
RESOLVED
```

The lifecycle is intentionally small for the MVP. The feedback detail page is where the business records the action taken and closes the loop.

---

# Analytics Architecture

The analytics service is the aggregation boundary for customer-experience reporting.


```text
Analytics Architecture

MongoDB Responses
        │
        ▼
Analytics Service
        │
        ├── Summary
        ├── Response Volume
        ├── NPS Breakdown
        ├── Top Topics
        └── Sentiment
             │
             ├── /dashboard
             └── /analytics
```

Typical analytics response structure:

```json
{
  "summary": {
    "totalResponses": 0,
    "nps": null,
    "csat": null,
    "ces": null
  },
  "responseVolume": [],
  "npsBreakdown": {},
  "topTopics": [],
  "sentiment": {}
}
```

Values should be derived from actual organization-scoped responses.

---

# Email & Security Flows

The backend contains a dedicated `email.service.js` and authentication routes for:

- verification email
- OTP password recovery
- OTP resend/invalidation
- reset password

This keeps email transport separate from controllers and authentication business logic.

The Google OAuth flow is handled through Passport configuration in `config/passport.js`.

---

# Environment Variables

Keep secrets outside the repository and never commit real credentials.

## Backend `.env`

```env
PORT=5000

MONGO_URI=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

CLIENT_URL=
NODE_ENV=development

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_EMAIL_ID=

SERVER_URL=

RESEND_API_KEY=

BREVO_API_KEY=
BREVO_FROM_EMAIL=
BREVO_FROM_NAME=
```

### Variable roles

| Variable | Purpose |
|---|---|
| `PORT` | Express server port |
| `MONGO_URI` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Signs access JWTs |
| `REFRESH_TOKEN_SECRET` | Signs refresh JWTs |
| `CLIENT_URL` | Frontend URL used for redirects and CORS |
| `NODE_ENV` | Runtime environment |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REFRESH_TOKEN` | Gmail OAuth refresh token for email sending |
| `GOOGLE_EMAIL_ID` | Email account used by the Gmail transport |
| `SERVER_URL` | Public backend URL used for OAuth / server callbacks |
| `RESEND_API_KEY` | Resend API key when Resend transport is enabled |
| `BREVO_API_KEY` | Brevo API key when Brevo transport is enabled |
| `BREVO_FROM_EMAIL` | Sender email for Brevo |
| `BREVO_FROM_NAME` | Sender name for Brevo |

## Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

For production, replace the frontend API URL and other deployment-specific values through the hosting platform's environment-variable manager.

> Never commit `.env`. Keep `.env.example` populated only with variable names and empty values.

# Local Development

## Backend

```bash
cd backend
npm install
npm run dev
```

If the project uses a production start command:

```bash
npm start
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend should run against the backend API through the configured Axios instance.

---

# Typical Development Sequence


```text
Typical Development Sequence

Authentication
      │
      ▼
Organization
      │
      ▼
Survey CRUD
      │
      ▼
Survey Publishing
      │
      ▼
Public Survey
      │
      ▼
Response Submission
      │
      ├── NPS / CSAT / CES
      └── Sentiment / Topics
               │
               ▼
         Feedback Inbox
               │
               ▼
         Feedback Detail
               │
               ▼
       Follow-up / Resolve

Response Submission
      ├──► Customers
      └──► Analytics
```

---

# API-to-Feature Mapping

```text
AUTH
├── register
├── login
├── email verification
├── Google OAuth
├── refresh token
├── me
├── logout
├── profile update
├── change password
└── forgot password / OTP

SURVEYS
├── create
├── list
├── get one
├── update
├── delete
└── publish

PUBLIC SURVEY
├── load survey
└── submit response

FEEDBACK
├── list
├── get one
└── update status

CUSTOMERS
├── list
└── detail + history

ANALYTICS
├── overview
└── trends
```

---

# Product Architecture at a Glance


```text
Product Architecture at a Glance

CLIENT
│
├── Landing
├── Authentication
├── Dashboard
├── Surveys
├── Feedback
├── Customers
├── Analytics
├── Settings
└── Public Survey
        │
        ▼
EXPRESS REST API
│
├── Auth Routes
├── Survey Routes
├── Response Routes
├── Customer Routes
├── Analytics Routes
├── Authentication / Validation Middleware
├── Controllers
└── Services
        │
        ▼
PERSISTENCE & PROCESSING
│
├── MongoDB
├── Email Service
├── Sentiment Service
└── Metrics Utilities
```

---

# Design & UX Principles

Recoz uses a premium light visual language across the marketing site, auth flow, dashboard, and product workspace.

### Brand palette

```text
#F62440  Primary accent
#FFE5BF  Soft peach
#FFF2DB  Warm cream
#FFFAF3  Main background
```

### Typography

- **Poppins** for headings and major visual hierarchy
- **Inter** for UI text, labels, forms, metadata, and body copy

### UX direction

- clean and spacious
- subtle borders and shadows
- restrained accent usage
- mobile-first public survey experience
- clear empty/loading/error states
- minimal but meaningful animations
- functional over decorative UI

---

# Security Notes

- Access/refresh JWTs are kept in HTTP-only cookies instead of browser local storage.
- Passwords are hashed before storage.
- Authentication middleware protects business-only routes.
- Organization ownership is checked before reading or updating private resources.
- Public survey routes do not require customer authentication.
- Password recovery uses an OTP/token workflow rather than trusting an email address alone.
- Secrets belong in environment variables, never in source code.

---

# What Makes the Project More Than a Survey Form

Recoz is not only a form builder.

The complete system is:

```text
CREATE
  ↓
COLLECT
  ↓
MEASURE
  ↓
UNDERSTAND
  ↓
FOLLOW UP
  ↓
RESOLVE
```

The survey is the entry point. The actual product is the workflow around the feedback after it is submitted.

---

# Current MVP Scope

Included:

- business authentication
- organization creation
- email verification
- Google OAuth
- password recovery with OTP
- survey CRUD
- dynamic survey questions
- survey publishing
- public customer survey
- customer records
- response storage
- NPS / CSAT / CES
- sentiment and topic analysis
- feedback inbox
- feedback status workflow
- customer history
- analytics dashboard
- QR sharing
- website widget sharing
- organization branding

Intentionally outside the current MVP scope:

- billing and subscriptions
- team/role management
- enterprise SSO
- CRM integrations
- SMS / WhatsApp messaging
- complex workflow automation
- advanced AI agents
- large-scale infrastructure such as Kafka or microservices

---

# End-to-End Example

A complete real-world journey looks like this:

```text
Business owner
    ↓
/register
    ↓
Create workspace
    ↓
User + Organization created
    ↓
Authenticated dashboard
    ↓
/surveys/create
    ↓
Create "Post Purchase Experience"
    ↓
Add CSAT + NPS + Text question
    ↓
Publish
    ↓
/surveys/publish
    ↓
Copy link / generate QR / install widget
    ↓
Customer opens public survey
    ↓
Customer answers questions
    ↓
POST response
    ↓
Create/reuse customer
    ↓
Store answers using questionId
    ↓
Calculate NPS / CSAT / CES
    ↓
Analyze sentiment + topics
    ↓
Feedback appears in /feedback
    ↓
Owner opens /feedback/:feedbackId
    ↓
Adds follow-up note
    ↓
Changes Open → In Progress
    ↓
Resolves feedback
    ↓
Customer history updates
    ↓
Analytics update
```

---

# Project Philosophy

Recoz is built around a simple idea:

> **Customer feedback is useful only when it can become a decision or an action.**

The architecture therefore follows the product workflow rather than creating isolated CRUD modules.

```text
Survey
  → Response
     → Metrics
     → Analysis
     → Feedback
        → Follow-up
        → Resolution
```

That relationship is the core of the entire system.

---

## License

This project is a personal project. Add your preferred license here if you decide to open-source it.
