WIQ Frontend (Work Intelligence Queue)

This is the frontend for the WIQ – Work Intelligence Queue application.
It is a React-based single-page application used to manage, track, and update work requests with priorities, statuses, comments, and agent assignments.
The frontend communicates with a REST API backend and provides an admin/agent-style workflow UI built with Material UI.

Features
**Dashboard with request statistics
**reate, edit, view, and delete work requests
**Filter, search, and sort requests
**Priority and status tracking
**Request comments and activity history
**Agent assignment
**Role switching (Admin / Agent – UI-level)
**Responsive UI using Material UI (MUI)
**Centralized API handling with Axios


_Tech Stack_

_React 18
_React Router v6
_Material UI (MUI v5)
_Axios for HTTP requests
_React Hook Form for form handling and validation
_date-fns for date formatting


 Project Structure
frontend/
├── package.json
├── src/
│   ├── components/
│   │   ├── RequestForm.js
│   │   ├── RequestList.js
│   │   └── UserSwitch.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   └── RequestDetail.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   └── index.js
└── README.md

_Setup & Installation_

_Prerequisites_
Node.js v16+
npm or yarn
Backend API running (default: http://localhost:5000)


_Install dependencies_
cd frontend
npm install

Start development server
npm start

The app will be available at:
http://localhost:3000


_Environment Variables_

The frontend expects the backend API URL to be provided via an environment variable.
Create a .env file in the frontend/ directory:
REACT_APP_API_URL=http://localhost:5000/api

If not set, it defaults to:
http://localhost:5000/api


 _API Integration_
All API calls are centralized in:
src/services/api.js

Axios Features
Base URL configuration
JSON request headers
Request interceptor for auth tokens
Response interceptor for handling 401 Unauthorized

Example endpoints used:
GET /requests
GET /requests/:id
POST /requests
PUT /requests/:id
DELETE /requests/:id
POST /requests/:id/comments
GET /requests/stats/summary

_Routing_

The app uses React Router v6.
RouteDescription/Dashboard/request/:idRequest detail view/createCreate new request/edit/:idEdit existing request*Redirects to dashboard

👤 User Roles (UI-Level)
The application supports Admin and Agent roles at the UI level via the UserSwitch component.


Admin
Can edit all requests

Agent
Limited editing based on request status





Note: Role handling is currently frontend-only and should be enforced by the backend for production use.


 _Forms & Validation_
Built with react-hook-form
Client-side validation for required fields
Loading and error states handled gracefully



 _UI & Theming_

Material UI with a custom light theme
Responsive layout using MUI Grid and Flexbox
Consistent spacing and typography
Status and priority color coding


_Scripts_
Available npm scripts:
npm start       # Run development server
npm build       # Build for production
npm test        # Run tests
npm eject       # Eject CRA configuration

_Notes & Future Improvements_

Replace mock agents with real backend data
Add authentication and role-based authorization
Improve error handling and notifications
Add unit and integration tests
Add pagination for large request lists