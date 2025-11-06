import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import Groups from "../components/Groups";
import Courses from "../components/Courses";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [driveLink, setDriveLink] = useState("");
  const [isLeader, setIsLeader] = useState(false);

  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
    checkIfLeader();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments");
      const grouped = res.data.reduce((acc, a) => {
        const course = a.title.split(" ")[0] || "General Course";
        if (!acc[course]) acc[course] = [];
        acc[course].push(a);
        return acc;
      }, {});
      setAssignments(grouped);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/submissions");  
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  const checkIfLeader = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/groups/user/${userId}`);
      if (res.data.group && res.data.group.creatorId === userId) {
        setIsLeader(true);
      } else {
        setIsLeader(false);
      }
    } catch (err) {
      console.error("Error checking group leader:", err);
      console.log(motion)
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
      fetchSubmissions();
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to submit. Try again!");
    }
  };

  const hasSubmitted = (assignmentId) => 
    submissions.some((s) => s.assignmentId === assignmentId); 

  const renderProgress = (assignmentId, status) => {
    if (hasSubmitted(assignmentId))
      return (
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <CheckCircle size={18} /> Submitted
        </div>
      );
    if (status === "Active")
      return (
        <div className="flex items-center gap-2 text-yellow-500 font-medium">
          <Clock size={18} /> Pending
        </div>
      );
    return (
      <div className="flex items-center gap-2 text-gray-500 font-medium">
        Not Started
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "assignments":
        return (
          <div className="max-w-5xl mx-auto">
            <Toaster position="top-center" richColors />
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-8">
              <BookOpen className="text-purple-800" size={28} />
              My Assignments
            </h2>

            {Object.keys(assignments).length === 0 ? (
              <div className="text-center text-gray-500">No assignments yet.</div>
            ) : (
              Object.entries(assignments).map(([course, courseAssignments]) => (
                <div key={course} className="mb-8">
                  <h3 className="text-xl font-semibold text-blue-700 mb-4">
                    {course} Course
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    {courseAssignments.map((a) => {
                      const submitted = hasSubmitted(a.id);

                      const canSubmit =
                        a.status === "Active" &&
                        !submitted &&
                        (a.type === "individual" || (a.type === "group" && isLeader)); // << FIX

                      return (
                        <motion.div
                          key={a.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-6 rounded-2xl shadow-sm border ${
                            submitted
                              ? "bg-gray-100 border-gray-200 opacity-60"
                              : "bg-white border-gray-100"
                          }`}
                        >
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            {a.title}
                          </h4>

                          <p className="text-gray-600 text-sm mb-3">
                            {a.description}
                          </p>

                          <div className="flex justify-between items-center mb-3">
                            <div className="text-sm text-gray-500">
                              Deadline:{" "}
                              <span className="font-medium text-gray-700">
                                {new Date(a.deadline).toLocaleDateString()}
                              </span>
                            </div>
                            {renderProgress(a.id, a.status)}
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-medium">Type:</span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                a.type === "group"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {a.type}
                            </span>
                          </div>

                          {canSubmit ? (
                            <button
                              onClick={() => {
                                setSelectedAssignment(a);
                                setShowModal(true);
                              }}
                              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold w-full"
                            >
                              Submit Assignment
                            </button>
                          ) : submitted ? (
                            <div className="mt-4 text-green-600 font-semibold text-center">
                              Submitted
                            </div>
                          ) : a.type === "group" && !isLeader ? (
                            <div className="mt-4 text-gray-400 text-center text-sm italic">
                              Only group leader can submit
                            </div>
                          ) : null}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))
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
                    <p className="text-gray-600 mb-6">
                      {selectedAssignment?.title}
                    </p>

                    <input
                      type="url"
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full border-2 border-gray-200 p-3 rounded-xl mb-6"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitAssignment}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
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

      case "courses":
        return <Courses role="student" />;
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
