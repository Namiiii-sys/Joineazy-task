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

      <div className="px-6 py-4 border-t">
        <button className="flex items-center gap-3 text-red-600 hover:text-red-700">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
