import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { PlusCircle, FileText, Users, Activity } from "lucide-react";
import Profile from "../components/Profile";
import AdminGroups from "../components/AdminGroups";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("assignments");
  const [showModal, setShowModal] = useState(false);
  const [assignments, setAssignments] = useState([]);

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    deadline: "",
    driveLink: "",
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("https://joineazy-backend.vercel.app/api/assignments");
      
      // adding dummy analytics for visual representation

      const dataWithAnalytics = res.data.map((a) => ({
        ...a,
        totalStudents: Math.floor(Math.random() * 25) + 10,
        submitted: Math.floor(Math.random() * 15), 
      }));
      setAssignments(dataWithAnalytics);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      console.log(motion)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.deadline) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      await axios.post("https://joineazy-backend.vercel.app/api/assignments", {
        title: newAssignment.title,
        description: "Uploaded through dashboard",
        deadline: newAssignment.deadline,
        driveLink: newAssignment.driveLink,
        createdBy: localStorage.getItem("userId"),
        status: "Active",
      });

      toast.success("Assignment created successfully!");
      setShowModal(false);
      setNewAssignment({ title: "", deadline: "", driveLink: "" });
      fetchAssignments();
    } catch (err) {
      console.error("Error creating assignment:", err);
      toast.error("Something went wrong while saving assignment!");
    }
  };

  const renderAnalyticsBar = (submitted, total) => {
    const percentage = total ? Math.min((submitted / total) * 100, 100) : 0;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const showContent = () => {
    if (activeTab === "assignments") {
      return (
        <div className="max-w-6xl mx-auto">
          <Toaster position="top-center" richColors />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3">
                <FileText className="text-blue-800" size={28} />
                Assignments Overview
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                Track submissions and manage active assignments
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <PlusCircle size={20} />
              Create Assignment
            </button>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={40} />
              </div>
              <p className="text-gray-600 text-lg">No assignments yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Create a new assignment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {assignments.map((a) => {
                const progress = Math.min(
                  (a.submitted / a.totalStudents) * 100,
                  100
                ).toFixed(0);

                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {a.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          a.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : a.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      Deadline:{" "}
                      <span className="font-medium text-gray-800">
                        {new Date(a.deadline).toLocaleDateString()}
                      </span>
                    </p>

                    {a.driveLink && (
                      <a
                        href={a.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm underline hover:text-blue-800"
                      >
                        Open Drive Folder
                      </a>
                    )}

                    <div className="mt-5">
                      <div className="flex justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>
                            {a.submitted}/{a.totalStudents} Submissions
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity size={15} />
                          <span>{progress}% Completed</span>
                        </div>
                      </div>
                      {renderAnalyticsBar(a.submitted, a.totalStudents)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Create New Assignment
                  </h3>

                  <form onSubmit={handleAddAssignment} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={newAssignment.title}
                        onChange={handleChange}
                        placeholder="Assignment title"
                        className="border-2 border-gray-200 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        Deadline
                      </label>
                      <input
                        type="date"
                        name="deadline"
                        value={newAssignment.deadline}
                        onChange={handleChange}
                        className="border-2 border-gray-200 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        Drive/OneDrive Link
                      </label>
                      <input
                        type="url"
                        name="driveLink"
                        value={newAssignment.driveLink}
                        onChange={handleChange}
                        placeholder="https://drive.google.com/..."
                        className="border-2 border-gray-200 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (activeTab === "groups") return <AdminGroups />;
    if (activeTab === "profile") return <Profile role="admin" />;
    if (activeTab === "courses") return <Courses role="admin" />;
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <Sidebar
        role="admin"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{showContent()}</div>
    </div>
  );
}
