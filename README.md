# WIQ - Work Intelligence Queue

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![Material--UI](https://img.shields.io/badge/Material--UI-5-0081cb.svg)

A comprehensive work request management system designed to streamline the process of creating, tracking, and managing work requests within an organization.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Production Build](#production-build)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

WIQ (Work Intelligence Queue) provides role-based access control, real-time status tracking, and efficient assignment workflows to help organizations manage their work requests effectively. The system features separate dashboards for administrators and agents, comprehensive filtering and search capabilities, and a commenting system for collaboration.

## ✨ Features

- **Role-Based Access Control**
  - Administrator role with full system access
  - Agent role with access to assigned work

- **Request Management**
  - Create, edit, and track work requests
  - Priority-based handling (High, Medium, Low)
  - Status workflow (Pending → Open → In Progress → Done)
  - Request approval/rejection system

- **Assignment System**
  - Assign requests to specific agents
  - Reassign or unassign functionality
  - Workload visibility

- **Collaboration**
  - Comment system for communication
  - Real-time updates
  - Activity tracking

- **Dashboard & Analytics**
  - Comprehensive statistics
  - Filterable request lists
  - Sortable columns
  - Search functionality

- **Responsive Design**
  - Mobile-friendly interface
  - Desktop-optimized layouts
  - Modern Material-UI components

## 🛠 Technology Stack

### Frontend
- **React 18** - UI framework
- **Material-UI (MUI) 5** - Component library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **Notistack** - Notification system
- **date-fns** - Date formatting

### Backend (Mock)
- Mock API service with localStorage
- Ready for backend integration
- RESTful API structure

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 14.0 or higher
- **npm** 6.0 or higher
- Modern web browser (Chrome, Firefox, Edge, or Safari)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wiq-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:3000
   ```

## 👤 Usage

### Demo Credentials

#### Administrator
- **Username:** `admin`
- **Password:** `admin123`

#### Agents
- **Username:** `agent1`, `agent2`, or `agent3`
- **Password:** `agent123`

### Administrator Workflow

1. **Login** with admin credentials
2. **Create requests** using the "New Request" button
3. **Approve/Reject** pending requests from the dashboard
4. **Assign agents** to open requests
5. **Monitor progress** through the dashboard statistics
6. **Manage agents** by adding or removing team members

### Agent Workflow

1. **Login** with agent credentials
2. **View assigned requests** on the dashboard
3. **Update status** of requests as work progresses
4. **Add comments** for collaboration
5. **Track workload** through personal statistics

## 🎭 User Roles

### Administrator
Full system access including:
- View all requests
- Approve/reject requests
- Create new requests
- Assign/reassign agents
- Edit request details
- Manage agent accounts
- View system-wide statistics

### Agent
Limited access to assigned work:
- View assigned requests only
- Update request status
- Update request priority
- Add comments
- View personal statistics

## 📁 Project Structure

```
wiq-system/
├── public/
│   ├── index.html          # HTML template
│   ├── favicon.ico         # Favicon
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # Reusable components
│   │   ├── AdminDashboard.js
│   │   ├── AgentDashboard.js
│   │   ├── RequestDetail.js
│   │   ├── RequestForm.js
│   │   └── UserSwitch.js
│   ├── pages/              # Page components
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── RequestDetail.js
│   │   └── RequestList.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── utils/              # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validation.js
│   │   ├── storage.js
│   │   ├── formatters.js
│   │   ├── errorHandler.js
│   │   └── index.js
│   ├── App.js              # Root component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies
└── README.md              # This file
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

### API Configuration

Edit `src/services/api.js` to configure the API base URL:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

## 💻 Development

### Available Scripts

#### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
The page will reload when you make changes.

#### `npm test`
Launches the test runner in interactive watch mode.

#### `npm run build`
Builds the app for production to the `build` folder.
Optimizes the build for best performance.

#### `npm run eject`
**Note: this is a one-way operation!**
Ejects from Create React App configuration.

### Code Style

The project follows these conventions:
- ES6+ JavaScript
- Functional components with hooks
- Material-UI styling system
- Async/await for asynchronous operations

## 🏗 Production Build

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Test the build locally**
   ```bash
   npx serve -s build
   ```

3. **Deploy to your server**
   - Upload the `build/` directory to your web server
   - Configure server for client-side routing (redirect all routes to index.html)

### Server Configuration Examples

**Apache (.htaccess)**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Nginx**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 📡 API Documentation

### Authentication

#### `POST /api/users/login`
Authenticate user credentials.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin User",
    "username": "admin",
    "role": "admin",
    "employeeId": "ADM-001"
  }
}
```

### Requests

#### `GET /api/requests`
Get all requests (with optional filters).

**Query Parameters:**
- `status` - Filter by status
- `priority` - Filter by priority
- `sortBy` - Sort field

**Response:**
```json
{
  "success": true,
  "requests": [
    {
      "id": 1,
      "title": "Database Backup Schedule",
      "description": "Need to set up automated daily backups...",
      "priority": "Medium",
      "status": "Pending",
      "createdDate": "2026-02-05T10:30:00Z",
      "createdBy": { "id": 101, "name": "John Doe" },
      "assignedAgent": null,
      "comments": []
    }
  ]
}
```

#### `POST /api/requests`
Create a new request.

**Request Body:**
```json
{
  "title": "Server Maintenance",
  "description": "Need to perform routine maintenance...",
  "priority": "High"
}
```

#### `PUT /api/requests/:id`
Update an existing request.

**Request Body:**
```json
{
  "status": "In Progress",
  "priority": "High"
}
```

#### `POST /api/requests/:id/comments`
Add a comment to a request.

**Request Body:**
```json
{
  "text": "Working on this now..."
}
```

### Users

#### `GET /api/users/agents`
Get all agents.

**Response:**
```json
{
  "success": true,
  "agents": [
    {
      "id": 201,
      "name": "Agent 1",
      "employeeId": "AGT-001",
      "role": "agent"
    }
  ]
}
```

## 🐛 Troubleshooting

### Common Issues

#### Login fails with valid credentials
- Clear browser cache and localStorage
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Check browser console for errors

#### Dashboard not loading
- Clear localStorage: Open console and run `localStorage.clear()`
- Restart development server
- Check network tab for failed requests

#### Redirect loop or blank screen
- Clear all browser data for localhost
- Log out and log back in
- Check for JavaScript errors in console

### Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Unsupported:**
- Internet Explorer (all versions)

### Performance Tips

- Use production build for deployment
- Enable browser caching
- Monitor browser console for warnings
- Close unused browser tabs

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write clear commit messages
- Update documentation as needed
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Material-UI for the component library
- React team for the framework
- All contributors and testers

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact your system administrator
- Check the documentation

---

**Version:** 1.0.0  
**Last Updated:** February 2026
