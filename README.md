# Nexora — Clean & Understandable MERN Project Management Platform


## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React + Vite + React Router + Axios |
| Styling  | Plain CSS (CSS variables, `src/styles/main.css`, no Tailwind) |
| State    | React Context + `useState` / `useEffect` (no Zustand / Redux) |
| Backend  | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth     | JWT (JSON Web Tokens) with `bcryptjs` |
| API      | Pure REST API (Route → Validator → Controller → Model) |
| Validation | `express-validator` |

> **Architecture Note:**  
> Socket.IO and WebSockets have been completely removed in favor of standard, predictable REST APIs.  
> Every user action follows a straightforward request/response cycle:
> `React Component` → `Axios` → `Express Route` → `Validator` → `Controller` → `Mongoose Model` → `MongoDB` → `JSON Response` → `React State Update`.

---

## Project Structure

```
Nexora/
├── client/                     ← React frontend
│   ├── src/
│   │   ├── api/                ← Axios API functions (auth, workspace, project, task, notification)
│   │   ├── components/         ← Reusable UI components (Navbar, Sidebar, Modal, TaskCard, etc.)
│   │   ├── context/            ← AuthContext + ThemeContext
│   │   ├── pages/              ← Clean, standalone page components
│   │   ├── styles/             ← main.css (complete styles with light/dark theme)
│   │   ├── App.jsx             ← Routing and layouts
│   │   └── main.jsx            ← App entry point
│   ├── .env                    ← VITE_API_URL
│   ├── package.json
│   └── vite.config.js
└── server/                     ← Express backend
    ├── config/                 ← db.js (Mongoose connection)
    ├── controllers/            ← Main business logic (no service layer)
    ├── middleware/             ← auth.js, validate.js, error.js
    ├── models/                 ← 8 Mongoose models
    ├── routes/                 ← Express route definitions
    ├── utils/                  ← asyncHandler, ApiError, generateToken
    ├── validators/             ← express-validator rules
    ├── server.js               ← Express server entry point (app.listen)
    ├── package.json
    └── .env.example
```

---

## Setup & Run

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nexora
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Features

- ✅ **Authentication**: Register, login, profile management, and persistent JWT sessions
- ✅ **Workspaces**: Multi-workspace support, workspace switcher, and role-based permissions (owner, admin, member)
- ✅ **Invitations**: Token-based workspace invite links (`/invite/:token`)
- ✅ **Projects**: Project creation, status tracking, member assignments, and deadlines
- ✅ **Kanban Board**: 4-column board (To Do, In Progress, Review, Done) with task detail modals and in-place status updates
- ✅ **Task Management**: Priorities, assignees, deadlines, and labels
- ✅ **Comments**: Task discussions with author permissions
- ✅ **Notifications**: In-app notifications for task assignments, comments, and invitations
- ✅ **Analytics**: Workspace stats, task completion rates, status breakdown, and priority breakdown
- ✅ **Activity Logs**: Automatic audit trails for project and task actions
- ✅ **Theme**: Polished Light and Dark mode with CSS variables and localStorage persistence

---

# 📚 REST API Routes Documentation

### Standard Request & Response Rules

1. **Base URL**: `http://localhost:5000/api`
2. **Authenticated Requests**:  
   Include the JWT token in the `Authorization` HTTP header:  
   `Authorization: Bearer <your_jwt_token>`
3. **Content Type**:  
   `Content-Type: application/json` for requests with JSON payloads.
4. **Error Responses**:  
   All error responses follow this standard JSON format:
   ```json
   {
     "message": "Error description here"
   }
   ```
   If validation fails via `express-validator`:
   ```json
   {
     "message": "Validation failed.",
     "errors": [
       { "field": "email", "message": "Please enter a valid email address." }
     ]
   }
   ```

---

## 1. System / Health Check

### `GET /api/health`
- **Auth**: Public
- **Description**: Quick health check to test if server is up and reachable.
- **Incoming Data**: None
- **Outgoing Data (200 OK)**:
  ```json
  {
    "status": "ok",
    "message": "Nexora server is running."
  }
  ```

---

## 2. Authentication Routes (`/api/auth`)

### `POST /api/auth/register`
- **Auth**: Public
- **Description**: Register a new user account. Hashes password using bcrypt.
- **Incoming Data (Body)**:
  ```json
  {
    "name": "Jane Doe",         // string, 2-50 chars (required)
    "email": "jane@example.com", // string, valid email format (required)
    "password": "password123"    // string, min 6 chars (required)
  }
  ```
- **Outgoing Data (201 Created)**:
  ```json
  {
    "message": "Account created successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "660c1d2e8b9f1a001a123456",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=Jane%20Doe"
    }
  }
  ```

---

### `POST /api/auth/login`
- **Auth**: Public
- **Description**: Authenticate with email and password to receive a JWT.
- **Incoming Data (Body)**:
  ```json
  {
    "email": "jane@example.com", // string, required
    "password": "password123"    // string, required
  }
  ```
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Logged in successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "660c1d2e8b9f1a001a123456",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=Jane%20Doe"
    }
  }
  ```

---

### `GET /api/auth/me`
- **Auth**: Protected (Bearer Token)
- **Description**: Get current user profile based on the JWT token.
- **Incoming Data**: None
- **Outgoing Data (200 OK)**:
  ```json
  {
    "_id": "660c1d2e8b9f1a001a123456",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=Jane%20Doe"
  }
  ```

---

### `PUT /api/auth/profile`
- **Auth**: Protected (Bearer Token)
- **Description**: Update user's name or custom avatar URL.
- **Incoming Data (Body)**:
  ```json
  {
    "name": "Jane Smith",                   // string, optional
    "avatar": "https://example.com/pic.png" // string URL or empty string, optional
  }
  ```
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Profile updated.",
    "user": {
      "_id": "660c1d2e8b9f1a001a123456",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "avatar": "https://example.com/pic.png"
    }
  }
  ```

---

## 3. Workspace Routes (`/api/workspaces`)

### `POST /api/workspaces`
- **Auth**: Protected (Bearer Token)
- **Description**: Create a new workspace. Creator automatically becomes `owner`.
- **Incoming Data (Body)**:
  ```json
  {
    "name": "Team Alpha",               // string, 1-50 chars (required)
    "description": "College Capstone"   // string, max 200 chars (optional)
  }
  ```
- **Outgoing Data (201 Created)**:
  ```json
  {
    "message": "Workspace created.",
    "workspace": {
      "_id": "660c20a18b9f1a001a123457",
      "name": "Team Alpha",
      "description": "College Capstone",
      "owner": {
        "_id": "660c1d2e8b9f1a001a123456",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "avatar": "https://example.com/pic.png"
      },
      "members": [
        {
          "user": {
            "_id": "660c1d2e8b9f1a001a123456",
            "name": "Jane Smith",
            "email": "jane@example.com",
            "avatar": "https://example.com/pic.png"
          },
          "role": "owner"
        }
      ],
      "createdAt": "2026-09-27T03:00:00.000Z"
    }
  }
  ```

---

### `GET /api/workspaces`
- **Auth**: Protected (Bearer Token)
- **Description**: Get all workspaces the logged-in user belongs to.
- **Incoming Data**: None
- **Outgoing Data (200 OK)**:
  ```json
  {
    "workspaces": [
      {
        "_id": "660c20a18b9f1a001a123457",
        "name": "Team Alpha",
        "description": "College Capstone",
        "owner": { ... },
        "members": [ ... ]
      }
    ]
  }
  ```

---

### `GET /api/workspaces/:id`
- **Auth**: Protected (Must be a member of the workspace)
- **Incoming Data**: URL param `:id` (Workspace ObjectId)
- **Outgoing Data (200 OK)**:
  ```json
  {
    "workspace": {
      "_id": "660c20a18b9f1a001a123457",
      "name": "Team Alpha",
      "description": "College Capstone",
      "owner": { ... },
      "members": [ ... ]
    }
  }
  ```

---

### `PUT /api/workspaces/:id`
- **Auth**: Protected (`owner` or `admin` only)
- **Description**: Update workspace name or description.
- **Incoming Data**: URL param `:id`, Body:
  ```json
  {
    "name": "Team Alpha Reborn",       // string, optional
    "description": "Updated project"   // string, optional
  }
  ```
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Workspace updated.",
    "workspace": { ... }
  }
  ```

---

### `DELETE /api/workspaces/:id`
- **Auth**: Protected (`owner` only)
- **Description**: Permanently delete workspace and all its projects, tasks, and invitations.
- **Incoming Data**: URL param `:id`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Workspace deleted."
  }
  ```

---

### `POST /api/workspaces/:id/invite`
- **Auth**: Protected (`owner` or `admin`)
- **Description**: Directly add an existing registered user to the workspace by email.
- **Incoming Data**: URL param `:id`, Body:
  ```json
  {
    "email": "alex@example.com" // string, required (must be registered user)
  }
  ```
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Alex added to workspace.",
    "workspace": { ... }
  }
  ```

---

### `DELETE /api/workspaces/:id/members/:userId`
- **Auth**: Protected (`owner` or `admin`)
- **Description**: Remove a member from the workspace (cannot remove workspace owner).
- **Incoming Data**: URL params `:id` (workspaceId), `:userId` (User ObjectId)
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Member removed.",
    "workspace": { ... }
  }
  ```

---

### `PUT /api/workspaces/:id/members/:userId/role`
- **Auth**: Protected (`owner` only)
- **Description**: Update a member's role (`admin` or `member`).
- **Incoming Data**: URL params `:id`, `:userId`, Body:
  ```json
  {
    "role": "admin" // enum: ["admin", "member"] (required)
  }
  ```
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Member role updated.",
    "workspace": { ... }
  }
  ```

---

### `GET /api/workspaces/:id/analytics`
- **Auth**: Protected (Member of workspace)
- **Description**: Workspace overview calculations (totals, completion rate, overdue, status & priority counts).
- **Incoming Data**: URL param `:id`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "totalProjects": 3,
    "totalTasks": 12,
    "completedTasks": 5,
    "overdueTasks": 1,
    "completionPercent": 42,
    "memberCount": 4,
    "tasksByStatus": {
      "todo": 3,
      "in_progress": 2,
      "review": 2,
      "done": 5
    },
    "tasksByPriority": {
      "low": 2,
      "medium": 6,
      "high": 3,
      "urgent": 1
    }
  }
  ```

---

## 4. Invitation Link Routes

### `POST /api/workspaces/:id/invitations`
- **Auth**: Protected (`owner` or `admin`)
- **Description**: Generate a 7-day token-based invitation link.
- **Incoming Data**: URL param `:id`, Body:
  ```json
  {
    "email": "collaborator@example.com", // string, required
    "role": "member"                     // enum: ["admin", "member"], default "member"
  }
  ```
- **Outgoing Data (201 Created)**:
  ```json
  {
    "message": "Invitation created.",
    "invitation": {
      "_id": "660c23f18b9f1a001a123458",
      "email": "collaborator@example.com",
      "workspace": "660c20a18b9f1a001a123457",
      "role": "member",
      "token": "4b7f8c028a39e8d47b5c...",
      "invitedBy": { "_id": "...", "name": "Jane Smith", "email": "..." },
      "expiresAt": "2026-10-04T03:00:00.000Z",
      "status": "pending"
    },
    "inviteLink": "/invite/4b7f8c028a39e8d47b5c..."
  }
  ```

---

### `GET /api/workspaces/:id/invitations`
- **Auth**: Protected (`owner` or `admin`)
- **Description**: List all active pending invitations for the workspace.
- **Incoming Data**: URL param `:id`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "invitations": [ ... ]
  }
  ```

---

### `DELETE /api/workspaces/:id/invitations/:invId`
- **Auth**: Protected (`owner` or `admin`)
- **Description**: Cancel a pending invitation link.
- **Incoming Data**: URL params `:id` (workspaceId), `:invId` (invitationId)
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Invitation cancelled."
  }
  ```

---

### `GET /api/invitations/:token`
- **Auth**: Public (No login required)
- **Description**: Get invitation details to display on the accept page.
- **Incoming Data**: URL param `:token`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "invitation": {
      "token": "4b7f8c028a39e8d47b5c...",
      "email": "collaborator@example.com",
      "role": "member",
      "workspace": { "_id": "...", "name": "Team Alpha" },
      "invitedBy": { "name": "Jane Smith", "email": "jane@example.com" }
    }
  }
  ```

---

### `POST /api/invitations/:token/accept`
- **Auth**: Protected (Logged-in user's email must match the invitation email)
- **Description**: Accept invitation and add user to workspace members.
- **Incoming Data**: URL param `:token`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "You have joined the workspace!",
    "workspace": { ... }
  }
  ```

---

## 5. Project Routes (`/api/...`)

### `POST /api/workspaces/:workspaceId/projects`
- **Auth**: Protected (Workspace `owner` or `admin`)
- **Description**: Create a project in a workspace.
- **Incoming Data**: URL param `:workspaceId`, Body:
  ```json
  {
    "title": "Frontend Redesign",             // string, 1-100 chars (required)
    "description": "Redo UI in clean CSS",    // string (optional)
    "status": "planning",                     // enum: ["planning", "active", "completed", "archived"]
    "deadline": "2026-10-15T00:00:00.000Z"    // date ISO string or null (optional)
  }
  ```
- **Outgoing Data (201 Created)**:
  ```json
  {
    "message": "Project created.",
    "project": {
      "_id": "660c25a08b9f1a001a123459",
      "title": "Frontend Redesign",
      "description": "Redo UI in clean CSS",
      "status": "planning",
      "deadline": "2026-10-15T00:00:00.000Z",
      "workspace": "660c20a18b9f1a001a123457",
      "owner": { ... },
      "members": [
        { "user": { ... }, "role": "manager" }
      ],
      "createdAt": "2026-09-27T03:00:00.000Z"
    }
  }
  ```

---

### `GET /api/workspaces/:workspaceId/projects`
- **Auth**: Protected (Workspace member)
- **Description**: Get all projects for a workspace with computed `taskCount` and `completedCount`.
- **Incoming Data**: URL param `:workspaceId`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "projects": [
      {
        "_id": "660c25a08b9f1a001a123459",
        "title": "Frontend Redesign",
        "status": "planning",
        "taskCount": 8,
        "completedCount": 3,
        "owner": { ... },
        "members": [ ... ]
      }
    ]
  }
  ```

---

### `GET /api/projects/:id`
- **Auth**: Protected (Workspace member)
- **Incoming Data**: URL param `:id` (projectId)
- **Outgoing Data (200 OK)**:
  ```json
  {
    "project": {
      "_id": "660c25a08b9f1a001a123459",
      "title": "Frontend Redesign",
      "description": "...",
      "status": "planning",
      "members": [ ... ]
    }
  }
  ```

---

### `PUT /api/projects/:id`
- **Auth**: Protected (Workspace `owner`/`admin` OR project `manager`)
- **Incoming Data**: URL param `:id`, Body:
  ```json
  {
    "title": "Frontend Modernization",        // optional
    "description": "Updated scope",           // optional
    "status": "active",                       // optional
    "deadline": "2026-10-20"                  // optional
  }
  ```
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Project updated.",
    "project": { ... }
  }
  ```

---

### `DELETE /api/projects/:id`
- **Auth**: Protected (Workspace `owner` or `admin`)
- **Description**: Delete project and cascade-deletes all its tasks and activity logs.
- **Incoming Data**: URL param `:id`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Project deleted."
  }
  ```

---

### `GET /api/projects/:id/members`
- **Auth**: Protected (Workspace member)
- **Outgoing Data (200 OK)**:
  ```json
  {
    "members": [
      {
        "user": { "_id": "...", "name": "Jane Smith", "email": "...", "avatar": "..." },
        "role": "manager"
      }
    ]
  }
  ```

---

### `POST /api/projects/:id/members`
- **Auth**: Protected (Workspace `owner`/`admin` OR project `manager`)
- **Description**: Add an existing workspace member to this specific project team.
- **Incoming Data**: URL param `:id`, Body:
  ```json
  {
    "userId": "660c1d2e8b9f1a001a123456", // string ObjectId, required
    "role": "developer"                     // enum: ["manager", "developer", "designer", "qa"]
  }
  ```
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Member added to project.",
    "members": [ ... ]
  }
  ```

---

### `DELETE /api/projects/:id/members/:userId`
- **Auth**: Protected (Workspace `owner`/`admin` OR project `manager`)
- **Incoming Data**: URL params `:id` (projectId), `:userId` (User ObjectId)
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Member removed from project."
  }
  ```

---

### `GET /api/projects/:id/activity`
- **Auth**: Protected (Workspace member)
- **Description**: Get recent 30 audit activities (task created, task moved, etc.).
- **Incoming Data**: URL param `:id`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "activities": [
      {
        "_id": "...",
        "user": { "name": "Jane Smith", "avatar": "..." },
        "action": "task_moved",
        "message": "Jane moved 'Navbar styling' to Done.",
        "createdAt": "2026-09-27T03:15:00.000Z"
      }
    ]
  }
  ```

---

## 6. Task Routes (`/api/...`)

### `POST /api/projects/:projectId/tasks`
- **Auth**: Protected (Workspace member)
- **Description**: Create a task in the project. If assignee is given, auto-generates a notification.
- **Incoming Data**: URL param `:projectId`, Body:
  ```json
  {
    "title": "Build Kanban UI",              // string, 1-100 chars (required)
    "description": "Implement 4 columns",    // string (optional)
    "status": "todo",                        // enum: ["todo", "in_progress", "review", "done"], default: "todo"
    "priority": "high",                      // enum: ["low", "medium", "high", "urgent"], default: "medium"
    "assignee": "660c1d2e8b9f1a001a123456", // User ObjectId or null (optional)
    "deadline": "2026-10-01",                // date string or null (optional)
    "labels": ["frontend", "ui"]             // array of strings (optional)
  }
  ```
- **Outgoing Data (201 Created)**:
  ```json
  {
    "message": "Task created.",
    "task": {
      "_id": "660c29a08b9f1a001a123460",
      "title": "Build Kanban UI",
      "description": "Implement 4 columns",
      "status": "todo",
      "priority": "high",
      "assignee": {
        "_id": "660c1d2e8b9f1a001a123456",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "avatar": "..."
      },
      "createdBy": {
        "_id": "...",
        "name": "Alex Patel"
      },
      "deadline": "2026-10-01T00:00:00.000Z",
      "labels": ["frontend", "ui"],
      "createdAt": "2026-09-27T03:30:00.000Z"
    }
  }
  ```

---

### `GET /api/projects/:projectId/tasks`
- **Auth**: Protected (Workspace member)
- **Description**: Fetch all tasks for a project to populate the Kanban board.
- **Incoming Data**: URL param `:projectId`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "tasks": [
      {
        "_id": "660c29a08b9f1a001a123460",
        "title": "Build Kanban UI",
        "status": "todo",
        "priority": "high",
        "assignee": { ... },
        "createdBy": { ... },
        "labels": ["frontend", "ui"]
      }
    ]
  }
  ```

---

### `GET /api/tasks/:id`
- **Auth**: Protected (Workspace member)
- **Incoming Data**: URL param `:id`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "task": { ... }
  }
  ```

---

### `PUT /api/tasks/:id`
- **Auth**: Protected (Workspace member)
- **Description**: Update any task field (title, description, status change, priority, assignee, deadline, labels).
- **Incoming Data**: URL param `:id`, Body (all fields optional):
  ```json
  {
    "status": "in_progress",
    "priority": "urgent"
  }
  ```
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Task updated.",
    "task": {
      "_id": "660c29a08b9f1a001a123460",
      "status": "in_progress",
      "priority": "urgent",
      ...
    }
  }
  ```

---

### `DELETE /api/tasks/:id`
- **Auth**: Protected (Workspace member)
- **Description**: Delete task and records an activity log entry.
- **Incoming Data**: URL param `:id`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Task deleted."
  }
  ```

---

## 7. Comment Routes (`/api/...`)

### `POST /api/tasks/:taskId/comments`
- **Auth**: Protected (Workspace member)
- **Description**: Add a comment to a task. Automatically notifies the task's assignee and creator.
- **Incoming Data**: URL param `:taskId`, Body:
  ```json
  {
    "content": "Started working on this component today." // string, 1-1000 chars (required)
  }
  ```
- **Outgoing Data (201 Created)**:
  ```json
  {
    "message": "Comment added.",
    "comment": {
      "_id": "660c30118b9f1a001a123461",
      "content": "Started working on this component today.",
      "task": "660c29a08b9f1a001a123460",
      "author": {
        "_id": "660c1d2e8b9f1a001a123456",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "avatar": "..."
      },
      "createdAt": "2026-09-27T03:35:00.000Z"
    }
  }
  ```

---

### `GET /api/tasks/:taskId/comments`
- **Auth**: Protected (Workspace member)
- **Description**: Get all comments for a task sorted in chronological order (oldest first).
- **Incoming Data**: URL param `:taskId`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "comments": [
      {
        "_id": "660c30118b9f1a001a123461",
        "content": "Started working on this component today.",
        "author": { ... },
        "createdAt": "..."
      }
    ]
  }
  ```

---

### `PUT /api/comments/:id`
- **Auth**: Protected (Comment author only)
- **Incoming Data**: URL param `:id`, Body:
  ```json
  {
    "content": "Edited comment text" // string, required
  }
  ```
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Comment updated.",
    "comment": { ... }
  }
  ```

---

### `DELETE /api/comments/:id`
- **Auth**: Protected (Comment author OR workspace owner/admin)
- **Incoming Data**: URL param `:id`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Comment deleted."
  }
  ```

---

## 8. Notification Routes (`/api/notifications`)

### `GET /api/notifications`
- **Auth**: Protected (Bearer Token)
- **Description**: Get latest 50 notifications for current user with unread count.
- **Incoming Data**: None
- **Outgoing Data (200 OK)**:
  ```json
  {
    "notifications": [
      {
        "_id": "660c32008b9f1a001a123462",
        "recipient": "660c1d2e8b9f1a001a123456",
        "actor": {
          "_id": "...",
          "name": "Alex Patel",
          "avatar": "..."
        },
        "type": "task_assigned",
        "message": "Alex Patel assigned you the task 'Build Kanban UI'.",
        "link": "/app/projects/660c25a08b9f1a001a123459",
        "read": false,
        "createdAt": "2026-09-27T03:36:00.000Z"
      }
    ],
    "unreadCount": 1
  }
  ```

---

### `PUT /api/notifications/:id/read`
- **Auth**: Protected (Owner of notification)
- **Description**: Mark a single notification as read.
- **Incoming Data**: URL param `:id`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Notification marked as read.",
    "notification": {
      "_id": "660c32008b9f1a001a123462",
      "read": true,
      ...
    }
  }
  ```

---

### `PUT /api/notifications/read-all`
- **Auth**: Protected (Bearer Token)
- **Description**: Mark all unread notifications of current user as read.
- **Incoming Data**: None
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "All notifications marked as read."
  }
  ```

---

### `DELETE /api/notifications/:id`
- **Auth**: Protected (Owner of notification)
- **Description**: Delete a notification.
- **Incoming Data**: URL param `:id`
- **Outgoing Data (200 OK)**:
  ```json
  {
    "message": "Notification deleted."
  }
  ```

---

## Team Members

| Name | GitHub |
|------|--------|
| Tanishq Patel | [@Legal-Thief](https://github.com/Legal-Thief) |
| Udita Singh | [@Udita84](https://github.com/Udita84) |
| Tanmai Pahwa | [@pahwatanmai08](https://github.com/pahwatanmai08) |
| Vidita Sharma | [@viditae0530-dot](https://github.com/viditae0530-dot) |
