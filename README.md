<div align="center">

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
<img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" />

<br/>
<br/>

# 🔗 Linkora — Chat App Frontend

**A modern real-time chat application frontend built with React + Vite**

[Getting Started](#-getting-started) · [Features](#-features) · [Folder Structure](#-folder-structure) · [API Config](#-api-configuration) · [Roadmap](#-roadmap)

---

</div>

## 📖 Overview

**Linkora** is the frontend layer of a full-stack chat application. Built with **React.js** and powered by **Vite**, it delivers a fast, component-driven UI with clean authentication flows and seamless API integration via Axios — designed to connect to a Django REST API backend.

---

## ⚙️ Tech Stack

| Technology | Purpose |
|---|---|
| **React.js (Vite)** | UI framework & bundler |
| **JavaScript (ES6+)** | Core language |
| **Axios** | HTTP client for API calls |
| **React Router DOM** | Client-side routing |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn
- Backend server running (see [Backend Requirements](#-backend-requirements))

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Linkora-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open your browser at:

```
http://localhost:5173
```

---

## 📁 Folder Structure

```
Linkora-app/
├── public/
└── src/
    ├── components/       # Reusable UI components
    ├── pages/            # Login & Register pages
    ├── services/         # Axios API configuration
    ├── App.jsx           # Root component & routing
    └── main.jsx          # Application entry point
```

---

## ✅ Features

- [x] User Registration UI
- [x] User Login UI
- [x] Client-side routing (Login ↔ Register)
- [x] API integration via Axios

---

## 🔧 API Configuration

Update the base URL in `src/services/api.js` to point to your backend:

```javascript
// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",  // ← Update this
});

export default api;
```

---

## 🖥️ Backend Requirements

This frontend is designed to work with a **Django REST Framework** backend.

- Backend server must be running before launching the frontend
- **CORS must be enabled** on the backend for `http://localhost:5173`
- Required API endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/login/` | Authenticate user |
| `POST` | `/api/register/` | Register new user |

> 💡 Using Django? Install [`django-cors-headers`](https://github.com/adamchainz/django-cors-headers) and add `http://localhost:5173` to `CORS_ALLOWED_ORIGINS`.

---

## 🛣️ Roadmap

- [ ] JWT token handling & refresh logic
- [ ] Protected routes (auth guards)
- [ ] Real-time messaging via WebSocket
- [ ] Chat UI with message threads
- [ ] User profile & avatar management
- [ ] Notifications system

---

## 📝 Notes

- Ensure `/api/login/` and `/api/register/` endpoints are functional before testing the UI
- Auth tokens should be stored securely — consider `httpOnly` cookies over `localStorage` for production

---

## 👤 Author

**Karthikeya Santosh Pawar**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com)

---

<div align="center">

Made with ❤️ using React + Vite

</div>
