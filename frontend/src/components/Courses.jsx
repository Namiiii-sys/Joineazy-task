import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, ClipboardCheck } from "lucide-react";

export default function Courses({ role }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  },[]);

  const fetchCourses = async () => {
    try {
      const dummyData =
        role === "admin"
          ? [
              {
                id: 1,
                name: "Data Mining",
                code: "WD101",
                studentCount: 28,
                submissionRate: 82,
              },
              {
                id: 2,
                name: "Data Mining",
                code: "WD101",
                studentCount: 28,
                submissionRate: 75,
              },
              {
                id: 3,
                name: "DBMS",
                code: "DS203",
                studentCount: 30,
                submissionRate: 67,
              },
            ]
          : [
              {
                id: 1,
                name: "Data Mining",
                code: "WD101",
                instructor: "Prof. Sharma",
                progress: 75,
              },
              {
                id: 2,
                name: "Operating Systems",
                code: "DS202",
                instructor: "Dr. Mehta",
                progress: 50,
              },
            ];

      setCourses(dummyData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setLoading(false);
      console.log(motion)
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-600">
        Loading courses...
      </div>
);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BookOpen className="text-purple-700" />{" "}
        {role === "admin" ? "Courses You Teach" : "My Courses"}
      </h2>

      {courses.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border text-center">
          <BookOpen className="text-gray-400 mx-auto mb-4" size={40} />
          <p className="text-gray-600 text-lg">No courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
               localStorage.setItem("activeTab","assignments");
               window.location.reload();
            }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {course.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4">Code: {course.code}</p>

              {role === "admin" ? (
                <>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-2">
                      <Users size={16} /> {course.studentCount} Students
                    </div>
                    <div className="flex items-center gap-2">
                      <ClipboardCheck size={16} /> {course.submissionRate}%
                      Submitted
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${course.submissionRate}%` }}
                    ></div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">
                    Instructor: <span className="font-medium">{course.instructor}</span>
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.progress}% Completed
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
