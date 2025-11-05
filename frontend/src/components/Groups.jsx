import React, { useState, useEffect } from "react";
import axios from "axios";
import generateGroupCode from "../utils/groupcode.js";
import { Users, Copy, Plus, LogIn, Mail } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function Groups() {
  const [group, setGroup] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`https://joineazy-backend.vercel.app/api/groups/user/${userId}`);
        if (res.data.group) setGroup(res.data.group);
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };
    fetchGroup();
  }, [userId]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return toast.error("Please enter a group name.");
    const code = generateGroupCode();

    try {
      const res = await axios.post("https://joineazy-backend.vercel.app/api/groups", {
        name: groupName,
        creatorId: userId,
        code,
      });
      setGroup(res.data.group);
      toast.success("Group created successfully!");
      setGroupName("");
    } catch (err) {
      console.error(err);
      toast.error("Error creating group.");
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) return toast.error("Enter a valid group code.");
    try {
      const res = await axios.post("https://joineazy-backend.vercel.app/api/groups/join", {
        groupCode: joinCode,
        studentId: userId,
      });
      setGroup(res.data.group);
      toast.success(res.data.message);
      setJoinCode("");
    } catch (err) {
      console.error(err);
      toast.error("Error joining group.");
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim()) return toast.error("Enter member email.");
    try {
      const res = await axios.post("https://joineazy-backend.vercel.app/api/groups/add-member", {
        creatorId: userId,
        groupId: group?.id,
        memberEmail,
      });

      if (res.data.success) {
        setGroup(res.data.group);
        toast.success(res.data.message);
        setMemberEmail("");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Axios error:", err);
      toast.error("Server error while adding member.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(group.code);
    toast.success("Code copied!");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <Toaster position="top-center" richColors />

      <div className="mb-8">
        <div className="flex">
        <Users className="text-purple-800 gap-2 mt-2 mr-2" size={28} />
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">My Group</h2>
        </div>
        <p className="text-gray-500">Manage your team.</p>
      </div>

      {group ? (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{group.name}</h3>
                <p className="text-gray-500 text-sm">
                  Created by {group.creatorName}
                </p>
              </div>
              
              <div className="bg-blue-50 px-4 py-3 rounded-xl flex items-center gap-3 border border-blue-100">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Group Code</p>
                  <p className="text-lg font-bold text-blue-600 tracking-wide">{group.code}</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            {group.creatorId == userId && (
              <div className="border-t border-gray-100 pt-6">
                <label className="block text-gray-700 font-medium mb-3 text-sm">
                  Add Team Member
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="member@email.com"
                    className="flex-1 border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  />
                  <button
                    onClick={handleAddMember}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                  >
                    Add Member
                  </button>
                </div>
              </div>
            )}
          </div>
          {group.members && group.members.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4">
                Members ({group.members.length})
              </h4>
              <div className="space-y-3">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium">{member.name}</p>
                      <p className="text-gray-500 text-sm truncate">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2.5 rounded-lg">
                <Plus size={20} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Create Group</h3>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Start a new team and invite members
            </p>
            
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
            <button
              onClick={handleCreateGroup}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors w-full font-semibold"
            >
              Create Group
            </button>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2.5 rounded-lg">
                <LogIn size={20} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Join Group</h3>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Use a code to join an existing team
            </p>
            
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter group code"
              className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
            />
            <button
              onClick={handleJoinGroup}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors w-full font-semibold"
            >
              Join Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
}