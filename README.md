# Joineazy - Group-based Assignment Management System



## Overview of UI/UX Design Choices

This system was built with a very intentional **minimalist UX philosophy**.

| UI/UX Choice | Reason |
|--------------|--------|
| Clean pastel gradients & whitespace | keeps the dashboard less stressful and easy to visually digest |
| Cards for assignments/courses | reduces cognitive load, easier scanning than table format |
| Progress bars & badges | visual feedback communicates faster than text feedback |
| Modal based submission creation | avoids unnecessary page routing, keeps user context |
| Subtle animations (Framer Motion) | makes interaction soft + modern without distracting |

This helps both **students & teachers** complete academic workflows quickly.

---

## JWT Based Authentication

This project uses **JWT (JSON Web Token)** for secure login.

### Flow:

1. User logs in  
2. Backend validates credentials  
3. Backend generates a signed JWT token  
4. Frontend stores token in `localStorage`  
5. Every protected API hit sends `Authorization: Bearer <token>`  
6. Backend verifies token → allows access

---

## ⚙️ Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Prisma CLI (`npm install prisma --save-dev`)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/namitamehra/joineazy.git
   cd joineazy
2. **Install Dependencies**

```bash
Copy code
npm install
cd frontend
npm install
```

3. **Setup Environment Variables**
  Create a .env file in the backend folder:

```env
Copy code
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/joineazy
JWT_SECRET=your_secret_key
```
4. **Run Prisma Migrations**

bash
Copy code
```
npx prisma migrate dev --name init
```
5. **Start the Backend**

bash
Copy code
```
npm start
```
6. **Start the Frontend**

bash
Copy code
```
cd frontend
npm run dev

```

---

**UI FLOW IMAGES:**



---

**Relationships (ER Diagram)**
```
  src/
 ├─ components/
 │   ├─ Sidebar.jsx
 │   ├─ Courses.jsx
 │   ├─ Groups.jsx
 │   └─ Profile.jsx
 │
 ├─ pages/
 │   ├─ Auth.jsx
 │   ├─ StudentDashboard.jsx
 │   └─ TeacherDashboard.jsx
 │
 └─ App.jsx
```
---

## 🏗️ Architecture Overview

### Frontend
- Built using **React.js** + **Tailwind CSS**
- **Axios** for API communication
- **Role-based dashboards:** Student & Admin

### Backend
- **Express.js** + **Prisma ORM**
- **RESTful APIs** under `/api/*`
- **JWT authentication** for session management

### Database
- **PostgreSQL**
- Connected via **Prisma ORM**

---

## 💡 Key Design & Deployment Decisions
- **Prisma ORM** – ensures data integrity and smooth migrations  
- **JWT Auth** – secure token-based authentication  
- **Tailwind CSS** – for consistent, responsive UI design  
- **RESTful API Structure** – modular and scalable  
- **PostgreSQL** – reliable relational database choice  

---

## 🚧 Limitations & Future Scope
Due to time constraints, some planned features couldn’t be added but are intended for future implementation:  
- Email notifications for member additions  
- Analytics dashboard for admins  
- Multi-admin workflow  

---

## 👩‍💻 Author
**Developed by:** Namita Mehra  
**Role:** Full Stack Developer   
**Institution:** Shaheed Sukhdev College of Business studies.
