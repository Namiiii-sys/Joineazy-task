import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import { BookOpen, Users, User } from "lucide-react";
import axios from "axios";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("assignments");
  const [groupCode, setGroupCode] = useState("");
  const [groupCreatedCode, setGroupCreatedCode] = useState("");
  const [assignments, setAssignments] = useState([]);

  React.useEffect(() => {
  fetchAssignments();
} , []);

 const fetchAssignments = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/assignments");
    setAssignments(res.data);
  } catch (err) {
    console.error("Error fetching assignments:", err);
  }
};


  // handle create group (mock for now)
  const handleCreateGroup = () => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGroupCreatedCode(randomCode);
    alert(`Group created successfully! Share this code with your teammates: ${randomCode}`);
  };

  // handle join group (mock)
  const handleJoinGroup = () => {
    if (!groupCode.trim()) {
      alert("Please enter a valid group code!");
      return;
    }
    alert(`Joined group with code: ${groupCode}`);
    setGroupCode("");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "assignments":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-700 flex items-center">
              <BookOpen className="mr-2" /> My Assignments
            </h2>
            {assignments.length === 0 ? (
              <p className="text-gray-600">No assignments yet.</p>
                ) : (
            assignments.map((a) => (
                            <div
                             key={a.id}
                             className="bg-white p-5 mb-3 rounded-lg shadow-md border-l-4 border-blue-500"
                              >
                               <h3 className="text-lg font-semibold">{a.title}</h3>
                                <div className="text-gray-600 text-sm mt-1">
                                  <div>Deadline: {new Date(a.deadline).toLocaleDateString()}</div>
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
                               
                               {a.driveLink && (
                               <a
                               href={a.driveLink}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-blue-500 text-sm underline mt-2 inline-block"
                              >
                               Submit on Drive
                              </a>
                               )}
                              </div>
                         </div>
                        ))
                      )}

                   </div>
        );

      case "team":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-700 flex items-center">
              <Users className="mr-2" /> My Team
            </h2>

            {/* Create Group Section */}
            <div className="bg-white rounded-lg shadow p-5 mb-6">
              <h3 className="text-lg font-semibold mb-3">Create a New Group</h3>
              <button
                onClick={handleCreateGroup}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Create Group
              </button>

              {groupCreatedCode && (
                <div className="mt-4">
                  <p className="text-gray-700">
                    <strong>Group Code:</strong> {groupCreatedCode}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Share this code with your teammates so they can join.
                  </p>
                </div>
              )}
            </div>

            {/* Join Group Section */}
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold mb-3">Join an Existing Group</h3>
              <input
                type="text"
                placeholder="Enter Group Code"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
                className="border border-gray-300 p-2 rounded w-1/2 focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleJoinGroup}
                className="ml-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Join
              </button>
            </div>
          </div>
        );

      case "profile":
        return (
          <div>
            <Profile role="student" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar
       role="student"
       activeTab={activeTab}
       setActiveTab={setActiveTab}
       onLogout={() => {
        localStorage.clear();
        window.location.reload();
    }}
/>


      <div className="flex-1 p-8">{renderContent()}</div>
    </div>
  );
}
