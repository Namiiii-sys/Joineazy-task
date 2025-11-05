import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import Groups from "../components/Groups";
import { BookOpen } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [driveLink, setDriveLink] = useState("");

  const userId = localStorage.getItem("userId");

  React.useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("https://joineazy-backend.vercel.app/api/assignments");
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!driveLink.trim()) return toast.error("Please enter your Drive link");

    try {
      const res = await axios.post("http://localhost:5000/api/submissions", {
        studentId: userId,
        assignmentId: selectedAssignment.id,
        driveLink,
      });

      toast.success(res.data.message);
      setShowModal(false);
      setDriveLink("");
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to submit. Try again!");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "assignments":
        return (
          <div className="max-w-5xl mx-auto">
            <Toaster position="top-center" richColors />
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <BookOpen className="text-purple-800" size={28} />
                My Assignments
              </h2>
              
            </div>

            {assignments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-gray-400" size={40} />
                </div>
                <p className="text-gray-600 text-lg">No assignments yet.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Check back later for new assignments
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((a) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {a.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Deadline:</span>
                            <span>{new Date(a.deadline).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Status:</span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                a.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : a.status === "Pending"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {a.status}
                            </span>
                          </div>
                        </div>

                        {a.driveLink && (
                          <a
                            href={a.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                          >
                            <span>📎</span>
                            View Assignment Link
                          </a>
                        )}
                      </div>

                      {a.status === "Active" && (
                        <button
                          onClick={() => {
                            setSelectedAssignment(a);
                            setShowModal(true);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                          Submit Assignment
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <AnimatePresence>
              {showModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
                  onClick={() => setShowModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Submit Assignment
                    </h3>
                    <p className="text-gray-600 mb-6">{selectedAssignment?.title}</p>
                    
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      Google Drive Link
                    </label>
                    <input
                      type="url"
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full border-2 border-gray-200 p-3 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    />
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitAssignment}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                      >
                        Submit
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case "team":
        return <Groups role="student" userId={userId} />;

      case "profile":
        return <Profile role="student" />;

      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <Sidebar
        role="student"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}