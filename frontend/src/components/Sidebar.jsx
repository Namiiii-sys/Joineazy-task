import React from "react";
import { Home, Users, FileText, BarChart2, LogOut, User } from "lucide-react";

export default function Sidebar({ role, activeTab, setActiveTab, onLogout }) {
  // student sidebar links
  const studentLinks = [
    { name: "Assignments", icon: <FileText size={18} />, key: "assignments" },
    { name: "My Team", icon: <Users size={18} />, key: "team" },
    { name: "Profile", icon: <User size={18} />, key: "profile" },
  ];

  // teacher sidebar links
  const adminLinks = [
    { name: "Assignments", icon: <FileText size={18} />, key: "assignments" },
    { name: "Group Info", icon: <Users size={18} />, key: "groups" },
    { name: "Profile", icon: <User size={18} />, key: "profile" },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <div className="h-screen w-60 bg-white shadow-lg flex flex-col justify-between">
      <div>
        <div className="p-6 text-3xl font-bold text-blue-600">Joineazy</div>

        <nav className="mt-6">
          {links.map((link) => (
            <div
              key={link.key}
              onClick={() => setActiveTab(link.key)}
              className={`flex items-center gap-3 p-5 text-gray-700 cursor-pointer hover:bg-blue-50 transition ${
                activeTab === link.key
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : ""
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t">
        <button
          onClick={() => {
            localStorage.clear();
            if (onLogout) onLogout();
          }}
          className="flex gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
