import { useEffect, useState } from "react";
import axios from "axios";

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

  if (loading) {
    return <p className="text-gray-600 p-6">Loading groups...</p>;
  }

  if (error) {
    return <p className="text-red-600 p-6">{error}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">All Groups</h2>

      {groups.length === 0 ? (
        <p className="text-gray-600">No groups found.</p>
      ) : (
        <div className="grid gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500"
            >
              <h3 className="text-2xl font-semibold text-blue-600">{group.name}</h3>
              <p className="text-gray-700">Code: {group.code}</p>
              <p className="text-gray-600 mb-3">
                Created by:{" "}
                <span className="font-medium">
                  {group.creator?.name || "Unknown"} ({group.creator?.email || "N/A"})
                </span>
              </p>

              {group.members && group.members.length > 0 ? (
                <div className="mt-4">
                  <h4 className="font-semibold text-blue-600 mb-2">Members</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    {group.members.map((m) => (
                      <li key={m.id}>
                        {m.name} ({m.email}){" "}
                        <span className="text-sm text-gray-500">[{m.role}]</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 italic">No members yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
