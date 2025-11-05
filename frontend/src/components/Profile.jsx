import { User } from "lucide-react";

export default function Profile({ role }) {
  const userName = localStorage.getItem("name") || "XYZ";
  const userEmail = localStorage.getItem("email") || "xyz@gmail.com";
  const joinedDate = "October 2024";

  const avatar =
    role === "admin"
      ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      : "https://cdn-icons-png.flaticon.com/512/3135/3135755.png";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3">
            <User className="text-purple-800" size={28} />
          Profile
        </h2>
        <p className="text-gray-500 mt-2 ml-1">View your account details</p>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-6 sm:p-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={avatar}
            alt="Profile Avatar"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-blue-100 object-cover"
          />

          <div className="flex-1 text-center sm:text-left space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">{userName}</h3>
            <p className="text-gray-600">{userEmail}</p>
            
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
                {role === "admin" ? "Teacher" : "Student"}
              </span>
              <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">
                Joined {joinedDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}