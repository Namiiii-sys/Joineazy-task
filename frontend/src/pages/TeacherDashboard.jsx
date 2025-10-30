import React from "react";
import Sidebar from "../components/Sidebar";
import { PlusCircle, FileText, BarChart2 } from "lucide-react";

export default function AdminDashboard() {
  const data = [
    {
      id: 1,
      title: "Database Design",
      dueDate: "2025-11-03",
      submissions: "6 / 10",
    },
    {
      id: 2,
      title: "Frontend Module",
      dueDate: "2025-11-10",
      submissions: "3 / 10",
    },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar role="admin" />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600">
            <PlusCircle size={18} />
            <span className="ml-2">Create Assignment</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <BarChart2 size={18} className="text-gray-600 mr-2" />
              <p className="text-gray-700 font-semibold">Total Assignments</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{data.length}</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <FileText size={18} className="text-gray-600 mr-2" />
              <p className="text-gray-700 font-semibold">Average Submissions</p>
            </div>
            <p className="text-2xl font-bold text-green-600">45%</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <FileText size={18} className="text-gray-600 mr-2" />
              <p className="text-gray-700 font-semibold">Pending Reviews</p>
            </div>
            <p className="text-2xl font-bold text-red-600">2</p>
          </div>
        </div>

      </div>
    </div>
  );
}
