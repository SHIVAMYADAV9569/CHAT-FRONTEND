import React from 'react';
import useConversation from '../../statemanage/useConversation.js';
import { useSocketContext } from '../../context/SocketContext.jsx';

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { onlineUsers } = useSocketContext(); // ✅ socket हटा दिया क्योंकि use नहीं हो रहा
  const isOnline = onlineUsers.includes(user._id);

  return (
    <div
      className={`hover:bg-slate-600 duration-300 ${
        isSelected ? "bg-slate-700" : ""
      }`}
      onClick={() => setSelectedConversation(user)}   // ✅ Corrected
    >
      <div className="flex space-x-3 px-5 py-6 cursor-pointer items-center">
        {/* Avatar */}
        <div className="relative">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img
                src={
                  user.avatarUrl ||
                  "https://img.daisyui.com/images/profile/demo/gordon@192.webp"
                }
                alt="User avatar"
              />
            </div>
          </div>
          {/* ✅ Online dot */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>
          )}
        </div>

        {/* User Details */}
        <div>
          <h1 className="font-bold">{user.name}</h1>
          <span className="text-sm text-gray-400">{user.email}</span>
        </div>
      </div>
    </div>
  );
}

export default User;
