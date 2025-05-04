# SkyT

This project is a full-stack smart crop management system for tea plantations designed to help estate owners and admins monitor estate data, manage tasks, control drones, and visualize environmental metrics in real-time.

---

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Material UI (MUI)
- React Router DOM
- Leaflet & Google Maps
- MUI X Charts

### Backend
- Node.js + Express
- TypeScript
- MySQL2 + Connection Pooling
- JWT Authentication
- REST API Architecture

### Other
- GitHub Actions (CI/CD)
- Cloudflare (Frontend Hosting)
- Vercel (Backend Hosting)
- EmailJS (for email verification)

---

## Features

### Core Functionalities
- User authentication and role-based access control (Owner, Assistant, Developer)
- Real-time dashboard for estate data visualization
- Profile management with email verification and image upload
- Task manager for drone-based operations (monitoring, fertilizing, memos)
- Employee management with permission handling
- Drone location visualization on the map with signal stats
- Sensor data ingestion & visualization (NPK, humidity, temperature)
- Notification system (task alerts, sensor thresholds)
- Gallery for daily drone image uploads

### Advanced Implementations
- Task lifecycle handling with concurrency control
- Estate and lot-based permission verification
- JSON storage optimization for task-to-lot mapping
- Time-series charting with filters (date range, node, value range)
- Drone control hooks (external service integration)
- Database-level access validation and relational integrity
- Custom middleware for token validation and error handling

---

## Setup Instructions

### 1. Clone the Repository
```cmd
git clone https://github.com/cepdnaclk/e20-3yp-SkyT.git
cd '04. WebApp'
```

### 2. Setup Environment Variables
Create `.env` files in `Frontend` and `Backend` folders.

Backend `.env` sample
```cmd
# Frontend
FRONTEND_URL=frontend_url

# Backend
PORT=backend_port
IMAGE_DIR=image_dir

# Database
DB_HOST=host_name
DB_PORT=port_number
DB_USER=user_name
DB_PASSWORD=password
DB_NAME=database_name

# Mailer
EMAIL_SERVICE=email_service
EMAIL_USER=company_email_address
EMAIL_PASS=app_password

# Hashing
JWT_SECRET=jwt_secret

# Weather Channel
ACCUWEATHER_API_KEY=api_key
ACCUWEATHER_BASE_URL=weather_channel_url
```

### 3. Start Backend
```cmd
cd Backend
npm install
npm start
```

### 3. Start Frontend
```cmd
cd Frontend
npm install
npm start
```

---

## Testing
- Jest + Supertest for backend unit and integration tests
- Manual API testing via Postman

---

## Project Structure
```cmd
.
├── Frontend/           # React frontend
│   ├── public/
│   ├── reference/
│   ├── src/
│   │   ├── api/
│   │   ├── asserts/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── Backend/            # Express backend
│   ├── images/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── service/
│   │   ├── util/
│   │   ├── app.ts
│   │   └── index.ts
│   ├── test/
│   ├── .env
│   ├── eslint.config.json
│   ├── jest.config.json
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── Database            # MySQL database Queries
├── Gallary             # Project Images
└── README.md
```
