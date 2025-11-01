import { User } from "lucide-react";

export default function Profile({ role }) {
  const userName = localStorage.getItem("name") || "XYZ";
  const userEmail = localStorage.getItem("email") || "xyz@gmail.com";
  const joinedDate = "October 2024";

  const avatar =
    role === "admin"
      ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      : "https://cdn-icons-png.flaticon.com/512/3135/3135755.png" ; 


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-blue-700 flex items-center">
        <User className="mr-2" /> Profile
      </h2>

      <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-6 w-3/4">
         <img
          src={avatar}
          alt="Profile Avatar"
          className="w-28 h-28 rounded-full border-2 border-blue-500 object-cover"
        />

        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-bold text-gray-800">{userName}</h3>
          <p className="text-gray-600">{userEmail}</p>
          <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full w-fit">
            {role === "admin" ? "Teacher" : "Student"}
          </span>
          <p className="text-sm text-gray-500 mt-1">
            Joined:{" "}
            <span className="font-medium text-gray-700">{joinedDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
