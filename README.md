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
5. ** Start the Backend **

bash
Copy code
```
npm start
```
6. ** Start the Frontend **

bash
Copy code
```
cd frontend
npm run dev
```


**API Endpoint Details**
Authentication
Method	Endpoint	Description
POST	/api/register	Register a new user
POST	/api/login	Login user and return token
Groups
Method	Endpoint	Description
POST	/api/groups	Create a new group
POST	/api/groups/join	Join group via code
GET	/api/groups/user/:userId	Get user’s group
POST	/api/groups/add-member	Add member by email (creator only)
GET	/api/admin/groups	Fetch all groups (admin only)
Assignments
Method	Endpoint	Description
POST	/api/assignments	Create new assignment
GET	/api/assignments	Fetch all assignments
