import React, { useState, useEffect } from "react";
import axios from "axios";
import generateGroupCode from "../utils/groupcode.js";

export default function Groups() {
  const [group, setGroup] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/groups/user/${userId}`);
        if (res.data.group) setGroup(res.data.group);
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };
    fetchGroup();
  }, [userId]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return alert("Please enter a group name.");
    const code = generateGroupCode();

    try {
      const res = await axios.post("http://localhost:5000/api/groups", {
        name: groupName,
        creatorId: userId,
        code,
      });
      setGroup(res.data.group);
      setMessage("Group created successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Error creating group.");
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) return alert("Enter a valid group code.");
    try {
      const res = await axios.post("http://localhost:5000/api/groups/join", {
        groupCode: joinCode,
        studentId: userId,
      });
      setGroup(res.data.group);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Error joining group.");
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim()) return alert("Enter member email.");
    try {
      const res = await axios.post("http://localhost:5000/api/groups/add-member", {
        creatorId: userId,
        groupId: group?.id,
        memberEmail,
      });

      if (res.data.success) {
        setGroup(res.data.group);
        setMessage(res.data.message);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error("Axios error:", err);
      setMessage("Server error while adding member.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">My Group</h2>

      {group ? (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">{group.name}</h3>
          <p className="text-gray-700 mb-1">
            Group Code: <strong>{group.code}</strong>
          </p>
          <p className="text-gray-600 mb-3">
            Created by: {group.creatorName} ({group.creatorEmail})
          </p>

          {group.creatorId == userId && (
            <div className="mt-4">
              <h4 className="font-semibold text-blue-600 mb-2">Add Member by Email</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="Enter member's email"
                  className="border border-gray-300 p-2 rounded w-full"
                />
                <button
                  onClick={handleAddMember}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {group.members && group.members.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-blue-600 mb-3">Group Members</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50 shadow-sm"
                  >
                    <p className="text-gray-800 font-medium">{member.name}</p>
                    <p className="text-gray-600 text-sm">{member.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Create a Group</h3>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleCreateGroup}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Create Group
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Join a Group</h3>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter group code"
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleJoinGroup}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Join Group
            </button>
          </div>
        </div>
      )}

      {message && <p className="mt-4 text-blue-600 font-medium">{message}</p>}
    </div>
  );
}
