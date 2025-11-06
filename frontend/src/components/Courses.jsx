import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, PlusCircle, Trash, ChevronRight, Users } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function Courses({ role, onCourseClick }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", code: "" });

  const teacherId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("https://joineazy-backend.vercel.app/api/courses");
      setCourses(Array.isArray(res.data) ? res.data : res.data.courses || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      console.log(motion)
    }
  };

  const createCourse = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code) return toast.error("Fill all fields");

    try {
      await axios.post("https://joineazy-backend.vercel.app/api/courses", {
        ...form,
        teacherId
      });

      toast.success("Course created!");
      setShowModal(false);
      setForm({ name: "", code: "" });
      fetchCourses();
    } catch (err) {
      console.error(err);
      toast.error("Error creating course");
    }
  };

  const deleteCourse = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`https://joineazy-backend.vercel.app/api/courses/${id}`);
      toast.success("Deleted!");
      fetchCourses();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting");
    }
  };

  if (loading) return <div className="text-center text-gray-500 py-8">Loading courses...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <Toaster position="top-center" richColors />
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <BookOpen className="text-purple-800" size={28} />
          My Courses
        </h2>

        {role === "admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <PlusCircle size={20} />
            New Course
          </button>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No courses available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => onCourseClick && onCourseClick(course)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mb-3">
                    Code: <span className="text-gray-700">{course.code}</span>
                  </p>
                </div>

                {role === "admin" && (
                  <button
                    onClick={(e) => deleteCourse(course.id, e)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash size={18} />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Users size={16} />
                  <span>View Details</span>
                </div>
                <ChevronRight 
                  size={20} 
                  className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" 
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Create New Course</h3>
              <form onSubmit={createCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Data Structures"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CS201"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}