# Espresso – Issues Management System

A full-stack Issues Management web application providing a realistic, production-style solution for managing issues with full CRUD, filtering, dashboard analytics and CSV import support.

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
- Modern, fast and widely used
- Express provides full routing control without unnecessary complexity
- TypeScript ensures type-safety and predictable code

---

### Database  
**PostgreSQL**
- Mature & reliable relational DB
- Ideal for structured issue data
- Strong querying & aggregation support

---

### Frontend  
**React + Vite**
- Component-based UI
- Clear separation between UI and API layer
- Extremely fast development experience (DX)

---

### CSV Import  
- Frontend uploads CSV text
- Backend parses, validates & stores in DB  
- Keeps business logic centralized in backend  

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
espresso_issues
```
Update `.env` in the server folder:
```
PORT=4000
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/espresso_issues
```
(Adjust username/password/host if needed)

If migrations are required in your setup, run them depending on your tooling.

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

In production, the frontend build output creates static files which can be:
- Served by the backend  
or  
- Served via Nginx / a static hosting solution  

---

## 📡 API Endpoints
```
GET    /api/issues
GET    /api/issues/:id
POST   /api/issues
PATCH  /api/issues/:id
POST   /api/issues/import-csv
```

---

## ☁️ Deployment to AWS (Conceptual Overview)

For deployment, the application can be deployed to an AWS **EC2 Free-Tier (t2.micro)** instance.

Deployment strategy:
1️⃣ Create an EC2 Ubuntu instance  
2️⃣ Open ports **22 (SSH)** and **80 (HTTP)**  
3️⃣ SSH into the instance  
4️⃣ Install Node.js, npm and Git  
5️⃣ Clone the repository  
6️⃣ Run `npm install` + `npm run build` for backend and frontend  
7️⃣ Run the backend using **PM2** so it stays alive  
8️⃣ Use **Nginx** as a reverse proxy to expose the app on port 80  
