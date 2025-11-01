# Joineazy - Group-based Assignment Management System

## 🧩 Overview

**Joineazy** is a full-stack web application that simplifies assignment coordination between **professors and students** through group management, OneDrive integration, and submission tracking.  
It provides separate dashboards for **students** and **admins (professors)** to streamline creation, submission, and monitoring of coursework.

---

## 🚀 Features

### Student Role
- Register and log in  
- Create or join groups using unique group codes  
- Add group members via email (creator-only)  
- View all assignments posted by professors  
- Access OneDrive links for submissions  
- Mark assignments as submitted (frontend simulation)  
- View group details and members in real time  

### Admin (Professor) Role
- Create, edit, and view assignments (title, description, due date, OneDrive link)  
- Assign work to all students or specific groups  
- View group-wise and student-wise submissions  
- Access analytics on submission completion and group performance *(planned)*  

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




## 🚀 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
|:------:|-----------|-------------|
| **POST** | `/api/register` | Register a new user |
| **POST** | `/api/login` | Login user and return token |

---

### 👥 Groups

| Method | Endpoint | Description |
|:------:|-----------|-------------|
| **POST** | `/api/groups` | Create a new group |
| **POST** | `/api/groups/join` | Join group via code |
| **GET** | `/api/groups/user/:userId` | Get user’s group |
| **POST** | `/api/groups/add-member` | Add member by email (creator only) |
| **GET** | `/api/admin/groups` | Fetch all groups (admin only) |

---

### 📝 Assignments

| Method | Endpoint | Description |
|:------:|-----------|-------------|
| **POST** | `/api/assignments` | Create new assignment |
| **GET** | `/api/assignments` | Fetch all assignments |

---

## 🗄 Database Schema (Prisma)

```prisma
model User {
  id             Int       @id @default(autoincrement())
  name           String
  email          String    @unique
  password       String
  role           String
  groupId        Int?
  group          Group?    @relation("UserGroup", fields: [groupId], references: [id])
  createdGroups  Group[]   @relation("CreatedGroups") 
  createdAt      DateTime  @default(now())
  Assignment     Assignment[]
}

model Group {
  id          Int       @id @default(autoincrement())
  name        String
  code        String    @unique
  creatorId   Int
  createdAt   DateTime  @default(now())
  members     User[]    @relation("UserGroup")
  creator     User      @relation("CreatedGroups", fields: [creatorId], references: [id])  
}

model Assignment {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  deadline    DateTime
  driveLink   String?
  createdBy   Int
  createdAt   DateTime  @default(now())
  teacher     User      @relation(fields: [createdBy], references: [id])
  status      String    @default("Active")
}
```
---
**Relationships (ER Diagram)**
```
  User (Admin)                                         
   ├── creates ──> Group ─── has ───> Users (Students)  
   └── creates ──> Assignment                           
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

**Flow Diagram**
```
[React Frontend]
       │
       ▼
[Express.js API Server]
       │
       ▼
[PostgreSQL Database]

```

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
- Persistent assignment submission tracking  
- Email notifications for member additions  
- Analytics dashboard for admins  
- Multi-admin workflow  
- Cloud deployment (**Vercel + Render** integration)  

---

## 👩‍💻 Author
**Developed by:** Namita Mehra  
**Role:** Full Stack Developer  
**Institution:** Shaheed Sukhdev College of Business Studies  
**License:** MIT
