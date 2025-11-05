import React, { useState } from "react";
import {
  Home,
  Users,
  FileText,
  BookOpen,
  BarChart2,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar({ role, activeTab, setActiveTab, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  // Student menu
  const studentLinks = [
    { name: "Courses", icon: <BookOpen size={20} />, key: "courses" },
    { name: "Assignments", icon: <FileText size={20} />, key: "assignments" },
    { name: "My Team", icon: <Users size={20} />, key: "team" },
    { name: "Profile", icon: <User size={20} />, key: "profile" },
  ];

  // Teacher (admin) menu
  const adminLinks = [
    { name: "Courses", icon: <BookOpen size={20} />, key: "courses" },
    { name: "Assignments", icon: <FileText size={20} />, key: "assignments" },
    { name: "Group Info", icon: <Users size={20} />, key: "groups" },
    { name: "Profile", icon: <User size={20} />, key: "profile" },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-xl shadow-lg"
      >
        {isOpen ? (
          <X size={24} className="text-gray-700" />
        ) : (
          <Menu size={24} className="text-gray-700" />
        )}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar main */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 h-screen w-72 bg-white shadow-xl flex flex-col justify-between border-r border-gray-100 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Joineazy
            </h1>
            <p className="text-gray-500 text-sm mt-2 ml-1">
              {role === "admin" ? "Professor Dashboard" : "Student Portal"}
            </p>
          </div>

          <nav className="mt-4 px-3">
            {links.map((link) => (
              <div
                key={link.key}
                onClick={() => {
                  setActiveTab(link.key);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-4 p-4 mb-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  activeTab === link.key
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className={activeTab === link.key ? "" : "text-gray-500"}>
                  {link.icon}
                </div>
                <span className="font-medium">{link.name}</span>
              </div>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={() => {
              localStorage.clear();
              if (onLogout) onLogout();
            }}
            className="flex items-center gap-3 w-full p-4 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-xl font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
