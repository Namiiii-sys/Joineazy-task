import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import Groups from "../components/Groups";
import { BookOpen, Users, User } from "lucide-react";
import axios from "axios";


export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);

  React.useEffect(() => {
  fetchAssignments();
} , []);

 const fetchAssignments = async () => {
  try {
    const res = await axios.get("https://joineazy-backend.vercel.app/api/assignments");
    setAssignments(res.data);
  } catch (err) {
    console.error("Error fetching assignments:", err);
  }
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
        return <Groups role="student" userId={localStorage.getItem("userId")}/>;

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
