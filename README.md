# Espresso – Issues Management System

A full-stack Issues Management web application with:
- Full CRUD (create / edit / delete / resolve)
- Filtering & search
- Dashboard statistics
- CSV import support
- Persistent database

The system is built as a realistic production-like solution with clean structure and maintainable code.

---

## 🎯 Project Overview

This project implements a complete issues management platform including:

- Backend REST API
- Modern Frontend UI
- Real Database (PostgreSQL)
- CSV import workflow
- Error handling and validation

The goal was to build a **real-world style application**, not just a simple demo.

---

## 🏗 Tech Stack & Rationale

### Backend
**Node.js + Express + TypeScript**
- Fast, modern and widely used
- Express provides full routing control without unnecessary complexity
- TypeScript ensures type safety, predictability and cleaner design

### Database
**PostgreSQL**
- Reliable and mature relational database
- Perfect for structured, consistent issue data
- Strong querying and aggregation capabilities

### Frontend
**React + Vite**
- Modern, component-based UI development
- Clear separation between UI logic and API
- Vite provides fast development environment and great DX

### CSV Import
- Frontend reads file → sends text to backend
- Backend handles parsing, validation and DB insert
- Keeps frontend simple & ensures consistent business logic

---

## 🚀 Features

- View issues
- Create / Edit / Delete
- Mark as Resolved
- Filter by:
  - text
  - status
  - severity
- Dashboard summary
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
