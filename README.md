# 🔍 Device Monitoring System

A full-stack, cyber-themed web application for real-time device monitoring, built with a modern tech stack and modular architecture. Designed for system administrators and IT engineers to track device status, uptime, and metrics across locations.

---

## 🚀 Features

- 📊 Dashboard with:
  - Total devices
  - Online vs Offline status
  - Devices per location (Pie chart)
  - Average uptime

- 🗂 Sidebar Navigation:
  - Tabs for each place
  - Expand to view devices
  - Device filtering with search bar

- ⚙️ Device Detail View:
  - Shows system info, IP, uptime, OS
  - Opened via click in sidebar

- ➕ Device Management:
  - Add, edit, and delete devices via modals
  - JWT-authenticated routes

- 🎨 Cyber UI:
  - Diagonal split landing page
  - Video background
  - Responsive dark theme

---

## 🛠 Tech Stack

### 🌐 Frontend

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Chart.js](https://www.chartjs.org/)

### 🧠 State Management

- React Context + LocalStorage for session

### ⚙️ Backend

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [JWT](https://jwt.io/)

### 📦 Architecture

- Modular MVC folder structure
- RESTful API design
- Frontend uses file-based routing with modals for device actions

---

## 📂 Folder Structure

monitor/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
├── frontend/
│ ├── app/
│ ├── components/
│ ├── context/
│ └── public/
└── README.md
