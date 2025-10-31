// src/components/Sidebar.jsx
import React from "react";
import { Home, Users, FileText, BarChart2, LogOut } from "lucide-react";

export default function Sidebar({ role }) {
  const studentLinks = [
    { name: "Dashboard", icon: <Home size={18} /> },
    { name: "My Group", icon: <Users size={18} /> },
    { name: "Assignments", icon: <FileText size={18} /> },
    { name: "Progress", icon: <BarChart2 size={18} /> },
  ];

  const adminLinks = [
    { name: "Dashboard", icon: <Home size={18} /> },
    { name: "Assignments", icon: <FileText size={18} /> },
    { name: "Submissions", icon: <Users size={18} /> },
    { name: "Analytics", icon: <BarChart2 size={18} /> },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;
  const onLogout = () => {
    // Optionally clear storage here if not already cleared by the button handler
    // window.localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="h-screen w-60 bg-white shadow-lg flex flex-col justify-between">
      <div>
        <div className="p-7 text-4xl font-bold text-blue-600">Joineazy</div>
        <nav className="mt-6">
          {links.map((link) => (
            <div
              key={link.name}
              className="flex items-center gap-3 p-7 text-gray-700 hover:bg-blue-50 cursor-pointer"
            >
              {link.icon}
              {link.name}
            </div>
          ))}
        </nav>
      </div>
        <button
        onClick={() => {
          localStorage.clear();
          onLogout();
        }}
        className="bg-white text-blue-900 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition mt-8"
      >
        Logout
      </button>

      
    </div>
  );
}
