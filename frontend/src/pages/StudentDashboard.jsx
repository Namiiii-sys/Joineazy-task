import React from "react";
import Sidebar from "../components/Sidebar";
import { BookOpen, CalendarDays, CheckCircle2 } from "lucide-react";

export default function StudentDashboard() {
  const assignments = [
    {
      id: 1,
      title: "Database Design",
      dueDate: "2025-11-03",
      status: "Submitted",
      grade: "A",
    },
    {
      id: 2,
      title: "Frontend Module",
      dueDate: "2025-11-10",
      status: "Pending",
      grade: "-",
    },
  ];

  

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar role="student" />
    

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-blue-600">
            Student Dashboard
          </h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600">
            <BookOpen size={18} />
            <span className="ml-2">View Materials</span>
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <CalendarDays size={18} className="text-gray-600 mr-2" />
              <p className="text-gray-700 font-semibold">Total Assignments</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {assignments.length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <CheckCircle2 size={18} className="text-gray-600 mr-2" />
              <p className="text-gray-700 font-semibold">Completed</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {
                assignments.filter((a) => a.status === "Submitted").length
              }
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <BookOpen size={18} className="text-gray-600 mr-2" />
              <p className="text-gray-700 font-semibold">Pending</p>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {
                assignments.filter((a) => a.status === "Pending").length
              }
            </p>
          </div>
        </div>

        {/* Assignment Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            My Assignments
          </h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50 text-left text-gray-700 font-semibold">
                <th className="p-3">Title</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Grade</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{a.title}</td>
                  <td className="p-3">{a.dueDate}</td>
                  <td
                    className={`p-3 font-medium ${
                      a.status === "Submitted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {a.status}
                  </td>
                  <td className="p-3">{a.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
