import { useState } from "react";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  // whenever someone types in input box
  const handleChange = (e) => {
    setFormData({
      ...formData, // keep old data
      [e.target.name]: e.target.value, // update new field
    });
  };

  // when user clicks Login or Signup
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page refresh

    try {
      if (isLogin) {

        const res = await axios.post("http://localhost:5000/api/login", {
          email: formData.email,
          password: formData.password,
        });

        alert(res.data.message + " ✅ (" + res.data.role + ")");
      } else {
        // REGISTER REQUEST
        const res = await axios.post("http://localhost:5000/api/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        alert(res.data.message + " 🎉");
      }
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="w-2/6 bg-white p-10 rounded-lg shadow-md">
        <h2 className="text-3xl text-center font-bold mb-6 text-blue-600">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-1">
                Name
               </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-400"
              />
            </div>
          )}

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-400"
            />
          </div>

        <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-400"
            />
          </div>

            <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
