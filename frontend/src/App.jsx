import React, { useState } from "react";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/TeacherDashboard";

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  const handleLoginSuccess = (userRole) => {
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
  };

  if (!role) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return role === "student" ? (
    <StudentDashboard onLogout={handleLogout} />
  ) : (
    <AdminDashboard onLogout={handleLogout} />
  );
}
