
# 🚆 Train Seat Reservation System

A full-stack web application for intelligently reserving train seats. The system allows users to sign up, log in, and reserve available seats following optimal seat allocation logic. Built using **Next.js**, **Node.js**, **Express**, and **PostgreSQL**, and deployed on **Render** and **Vercel**.

---


## 🚀 Live Application

- **Frontend:** [https://train-seat-reservation-ruby.vercel.app](https://train-seat-reservation-ruby.vercel.app)

---

## 🧰 Tech Stack

| Layer       | Technology            |
|-------------|------------------------|
| Frontend    | React.js, Tailwind CSS  |
| Backend     | Node.js, Express.js    |
| Database    | PostgreSQL             |
| Deployment  | Vercel (Frontend), Render (Backend) |

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/train-seat-reservation.git
cd train-seat-reservation
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

---

### 3. Backend Setup

```bash
cd backend
npm install
```


---

## 🔐 Authentication

- JWT-based authentication.
- Passwords hashed using bcrypt.
- Token stored in `localStorage` or `HttpOnly cookies` (configurable).
- Middleware-protected private routes.

---

## 📱 Responsive UI

- Built with Tailwind CSS
- Mobile-first responsive layout
- Clean and accessible user experience

---

## ✅ Features Checklist

- [x] User login and signup
- [x] Intelligent booking of 1–7 seats
- [x] Prioritize same row booking
- [x] Book nearby seats if necessary
- [x] JWT-based authentication
- [x] Public and protected routes
- [x] Seats locked per user once booked
- [x] Clean and responsive UI
- [x] API error handling and validation
- [x] Sanitized inputs
- [x] Clear and consistent UI/UX
- [x] Readable and maintainable code
- [x] Dynamic routing using Next.js

---

## 🛡️ Best Practices Used

- Input validation & sanitization (`express-validator`)
- Password hashing (`bcrypt`)
- JWT token auth
- Proper folder structure and modularity
- Error handling middleware
- Environment-based config


---

## 🧑‍💻 Author

**Deepak Kumar Sahu**  
MERN Stack Developer  
[GitHub](https://github.com/deepakkumar1211) • [LinkedIn](https://www.linkedin.com/in/deepak-kumar-sahu12) • [Portfolio](https://deepaksahu.vercel.app)


---
