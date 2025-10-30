import React, { useState } from "react";

export default function Auth() {
  const [login, setLogin] = useState(true);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (login) {
      console.log("Login Info:", data);
    } else {
      console.log("Signup Info:", data);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="w-2/6 bg-white p-10 rounded-lg shadow-md">
        <h2 className="text-3xl text-center font-bold mb-6 text-blue-600">
          {login ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit}>
          {!login && (
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-1">
                Name
               </label>
              <input
                type="text"
                name="name"
                value={data.name}
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
              value={data.email}
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
              value={data.password}
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
              value={data.role}
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
            {login ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {login ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium hover:underline"
            onClick={() => setLogin(!login)}
          >
            {login ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
