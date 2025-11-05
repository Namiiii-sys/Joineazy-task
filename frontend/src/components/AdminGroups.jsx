import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Copy } from "lucide-react";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";

export default function AdminGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("https://joineazy-backend.vercel.app/api/admin/groups");
        setGroups(res.data.groups || []);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Unable to fetch groups.");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
    console.log(motion)
    
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="animate-pulse">
            <div className="bg-gray-200 w-20 h-20 rounded-full mx-auto mb-4"></div>
            <div className="bg-gray-200 h-4 w-32 mx-auto rounded"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading groups...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <Toaster position="top-center" richColors />

      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3 flex-wrap">
          <Users className="text-purple-800" size={28} />
          All Groups
        </h2>
        <p className="text-gray-500 mt-2 ml-1">
          View and manage all student groups
        </p>
        
      </div>

      {groups.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-gray-400" size={40} />
          </div>
          <p className="text-gray-600 text-lg">No groups found.</p>
          <p className="text-gray-400 text-sm mt-2">
            Groups will appear here once students create them
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {group.name}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center gap-2 mb-3">
                    Created by {group.creator?.name || "Unknown"}
                    <span className="text-gray-400">
                      ({group.creator?.email || "N/A"})
                    </span>
                  </p>
                </div>

                <div className="bg-blue-50 px-4 py-3 rounded-xl flex items-center gap-3 border border-blue-100 self-start">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Code</p>
                    <p className="text-lg font-bold text-blue-600 tracking-wide">
                      {group.code}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(group.code)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              {group.members && group.members.length > 0 ? (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-blue-500" />
                    Members ({group.members.length})
                  </h4>
                  <div className="space-y-3">
                    {group.members.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-medium">{m.name}</p>
                          <p className="text-gray-500 text-sm truncate">{m.email}</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-gray-400 text-sm italic">No members yet.</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}