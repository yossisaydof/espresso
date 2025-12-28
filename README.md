# Espresso – Issues Management System

A full-stack Issues Management web application providing a solution for managing issues with full CRUD, filtering, dashboard analytics and CSV import support.

---

## 🎯 Project Overview

Espresso is a complete **Issues Management Platform** including:

- Backend REST API  
- Modern Frontend UI  
- Real Database (PostgreSQL)  
- CSV import workflow  
- Error handling and validation  

The intention was to build a **real-world style system**, not just a toy demo.

---

## 🏗 Tech Stack & Rationale

### Backend  
**Node.js + Express + TypeScript**
- Express provides full routing control without unnecessary complexity
- TypeScript ensures type-safety and predictable code

---

### Database  
**PostgreSQL**
- Mature & reliable relational DB
- Ideal for structured issue data

---

### Frontend  
**React + Vite**
- Clear separation between UI and API layer
- Extremely fast development experience (DX)

---

### CSV Import  
- Frontend uploads CSV text
- Backend parses, validates & stores in DB  

A sample CSV file is included:
```
issues.csv
```

---

## 🚀 Features

- View issues  
- Create / Edit / Delete  
- Mark as Resolved  
- Filtering by:
  - Text
  - Status
  - Severity
- Dashboard statistics  
- Import issues from CSV file  

---

## 📂 Project Structure

### Server
```
server/
  src/
    controllers/
    services/
    routes/
    types/
    utils/
    db.ts
    index.ts
```
### Frontend
```
frontend/
  src/
    api/
    components/
    pages/
    styles.css
    app.jsx
    main.jsx
```

---

## ▶️ Run the Project Locally

### Backend
```bash
cd server
npm install
npm run dev
```
The backend will run at:
```
http://localhost:4000
```

---

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will run at:
```
http://localhost:3000
```

---

## 🗄 Database Setup (PostgreSQL)

Make sure PostgreSQL is running locally or remotely.

Create a database:
```
issues_db
```
Update `.env` in the server folder:
```
PORT=4000
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/issues_db
```

---

## ▶️ Production Build

### Backend
```bash
cd server
npm install
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
```

---

## 📡 API Endpoints
```
GET    /api/issues
GET    /api/issues/:id
POST   /api/issues
PATCH  /api/issues/:id
POST   /api/issues/import-csv
```
