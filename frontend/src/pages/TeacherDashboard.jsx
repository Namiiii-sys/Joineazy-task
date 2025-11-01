import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { PlusCircle, FileText, Users, User } from "lucide-react";
import axios from "axios";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("assignments");
  const [showModal, setShowModal] = useState(false);

  const [assignments, setAssignments] = useState([]);

  React.useEffect(() => {
  fetchAssignments();
  }, []);

   const fetchAssignments = async () => {
    try {
    const res = await axios.get("http://localhost:5000/api/assignments");
    setAssignments(res.data);
  } catch (err) {
    console.error("Error fetching assignments:", err);
  }
};


  const [newAssignment, setNewAssignment] = useState({
    title: "",
    deadline: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  const handleFileUpload = (e) => {
    setNewAssignment({ ...newAssignment, file: e.target.files[0] });
  };

  const handleAddAssignment = async (e) => {
  e.preventDefault();
  if (!newAssignment.title || !newAssignment.deadline) {
    alert("Please fill all fields!");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/assignments", {
      title: newAssignment.title,
      description: "Uploaded through dashboard",
      deadline: newAssignment.deadline,
      teacherId: localStorage.getItem("userId"),
      Status: "Active",
    });

    alert("Assignment created successfully!");
    setShowModal(false);
    setNewAssignment({ title: "", deadline: "", file: null });
    fetchAssignments(); 
  } catch (err) {
    console.error("Error creating assignment:", err);
    alert("Something went wrong while saving assignment!");
  }
};


  const showContent = () => {
    if (activeTab === "assignments") {
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
              <FileText className="mr-2" /> Assignments
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
            >
              <PlusCircle size={18} className="mr-2" />
              Create Assignment
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500"
              >
                <h3 className="text-lg font-semibold">{a.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Deadline: {a.deadline}
                </p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    a.status === "Active" ? "text-green-600" : "text-orange-500"
                  }`}
                >
                 <p
           className={`mt-2 text-sm font-medium ${
    a.status === "Active"
      ? "text-green-600"
      : a.status === "Pending"
      ? "text-orange-500"
      : "text-gray-500"
           }`}
          >
        Status: {a.status}
</p>

                </p>
              </div>
            ))}
          </div>

          {/* modal for adding new assignment */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">
                  Create New Assignment
                </h3>

                <form onSubmit={handleAddAssignment}>
                  <label className="block mb-2 font-medium">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newAssignment.title}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded mb-4"
                  />

                  <label className="block mb-2 font-medium">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={newAssignment.deadline}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded mb-4"
                  />

                  <label className="block mb-2 font-medium">Upload File</label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="border border-gray-300 p-2 w-full rounded mb-4"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "groups") {
      return (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700 flex items-center">
            <Users className="mr-2" /> Group Info
          </h2>
          <p className="text-gray-600">
            You can view all created student groups and their members here
            (feature to be added later).
          </p>
        </div>
      );
    }

    if (activeTab === "profile") {
      return (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700 flex items-center">
            <User className="mr-2" /> Profile
          </h2>
          <div className="bg-white rounded-lg shadow p-6 w-2/3">
            <p><strong>Name:</strong> Prof. Ria Arora</p>
            <p><strong>Email:</strong> riaarora@college.edu</p>
            <p><strong>Role:</strong> Teacher</p>
            <p><strong>Joined:</strong> October 2024</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar
        role="admin"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />
      <div className="flex-1 p-8">{showContent()}</div>
    </div>
  );
}
