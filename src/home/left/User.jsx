import React from 'react';
import useConversation from '../../statemanage/useConversation.js';
import { useSocketContext } from '../../context/SocketContext.jsx';

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { onlineUsers } = useSocketContext(); // ✅ socket हटा दिया क्योंकि use नहीं हो रहा
  const isOnline = onlineUsers.includes(user._id);

  const statusText = user.status?.text;
  const statusType = user.status?.type;
  const statusMedia = user.status?.mediaUrl;

  return (
    <div
      className={`hover:bg-slate-600 duration-300 ${
        isSelected ? "bg-slate-700" : ""
      }`}
      onClick={() => setSelectedConversation(user)}
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
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>
          )}
          {user.unreadCount > 0 && (
            <span className="absolute top-0 right-0 rounded-full bg-red-600 text-white text-[10px] px-2 py-0.5">
              {user.unreadCount}
            </span>
          )}
        </div>

        {/* User Details */}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h1 className="font-bold">{user.name}</h1>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isOnline ? "bg-green-600" : "bg-gray-600"
              } text-white`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <span className="text-sm text-gray-400 block">{user.email}</span>
          {statusText && (
            <p className="text-xs text-gray-300 mt-1 truncate max-w-[180px]">
              Status: {statusText}
            </p>
          )}
          {!statusText && statusMedia && (
            <p className="text-xs text-gray-300 mt-1 truncate max-w-[180px]">
              Status media available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;
