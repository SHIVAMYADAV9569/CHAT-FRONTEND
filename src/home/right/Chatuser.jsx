import React, { useState, useEffect } from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import useCallManager from "../../context/useCallManager.jsx";
import { useAuth } from "../../context/AuthProvider.jsx";
import StatusViewer from "../../components/StatusViewer.jsx";
import { IoCall, IoVideocam, IoHeart, IoEye } from "react-icons/io5";
import { HiMenu } from 'react-icons/hi';

function Chatuser({ setIsSidebarOpen }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers, userUpdates } = useSocketContext();
  const { authUser } = useAuth();
  const [showStatusViewer, setShowStatusViewer] = useState(false);
  const {
    incomingCall,
    callActive,
    callType,
    localStream,
    remoteStream,
    callUser,
    answerCall,
    declineCall,
    endCall,
  } = useCallManager();
  console.log(selectedConversation);

  // Update selected conversation when user profile/status changes
  useEffect(() => {
    if (userUpdates?.userId && selectedConversation?._id === userUpdates.userId) {
      setSelectedConversation({
        ...selectedConversation,
        ...userUpdates.userData,
      });
    }
  }, [userUpdates, selectedConversation, setSelectedConversation]);

  const getOnlineUserStatus = (user) => {
  if (onlineUsers.includes(user._id)) {
    return "online";
  } else {
    if (user.lastSeen) {
      const lastSeenDate = new Date(user.lastSeen);
      const now = new Date();
      const diffMs = now - lastSeenDate;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "last seen just now";
      if (diffMins < 60) return `last seen ${diffMins} min ago`;
      if (diffHours < 24) return `last seen ${diffHours} hour ago`;
      return `last seen ${diffDays} day ago`;
    }
    return "Offline";
  }
 }

  const status = selectedConversation?.status || {};
  const isOnline = selectedConversation && onlineUsers.includes(selectedConversation._id);

  const handleStatusUpdate = (userId) => {
    // Update the selected conversation to reflect new likes/views
    if (userId === selectedConversation?._id) {
      // Trigger a refresh of user data if needed
    }
  };

  const handleCall = (type) => {
    if (!selectedConversation || !authUser?.user?._id) {
      alert("Please select a user to call");
      return;
    }
    if (!onlineUsers.includes(selectedConversation._id)) {
      alert("User is offline. Cannot make a call.");
      return;
    }
    callUser(selectedConversation._id, type);
  };

  return (
    <div className="flex flex-col gap-3 p-2 md:p-4 bg-gray-900 border-b border-gray-700">
      <button className="md:hidden text-white p-2 self-start bg-slate-800 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
        <HiMenu className="text-2xl" />
      </button>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative cursor-pointer" onClick={() => selectedConversation?.status?.postedAt && setShowStatusViewer(true)}>
          <div className="avatar online hover:ring-2 hover:ring-blue-500 transition-all duration-200">
            <div className="w-16 rounded-full overflow-hidden border border-gray-600">
              <img
                src={
                  selectedConversation?.avatarUrl ||
                  "https://img.daisyui.com/images/profile/demo/gordon@192.webp"
                }
                alt="Selected user"
              />
            </div>
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-xl font-bold">{selectedConversation?.name}</h1>
          <p className="text-sm text-gray-400">
            {getOnlineUserStatus(selectedConversation)}
          </p>
          {status.text && (
            <p className="text-xs text-gray-300 mt-1 truncate max-w-2xl">
              Status: {status.text}
            </p>
          )}
          {status.mediaUrl && (
            <p className="text-xs text-gray-300 mt-1 truncate max-w-2xl">
              {status.type === "video" ? "Shared a status video" : "Shared a status media"}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="btn btn-sm btn-outline btn-success"
            onClick={() => handleCall("voice")}
          >
            <IoCall className="mr-1" /> Voice
          </button>
          <button
            className="btn btn-sm btn-outline btn-info"
            onClick={() => handleCall("video")}
          >
            <IoVideocam className="mr-1" /> Video
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <button
          onClick={() => selectedConversation?.status?.postedAt && setShowStatusViewer(true)}
          className="inline-flex items-center gap-1 cursor-pointer hover:text-blue-400 transition-colors duration-200"
          disabled={!selectedConversation?.status?.postedAt}
        >
          <IoEye /> {status.viewers?.length || 0} views
        </button>
        <button
          onClick={() => selectedConversation?.status?.postedAt && setShowStatusViewer(true)}
          className="inline-flex items-center gap-1 cursor-pointer hover:text-red-400 transition-colors duration-200"
          disabled={!selectedConversation?.status?.postedAt}
        >
          <IoHeart /> {status.likes?.length || 0} likes
        </button>
      </div>

      {incomingCall && (
        <div className="bg-gray-800 p-3 rounded-lg border border-blue-500 mt-3">
          <p className="text-sm text-white">
            Incoming {incomingCall.callType} call from {incomingCall.name}
          </p>
          <div className="mt-2 flex gap-2">
            <button className="btn btn-sm btn-success" onClick={answerCall}>
              Answer
            </button>
            <button className="btn btn-sm btn-error" onClick={declineCall}>
              Decline
            </button>
          </div>
        </div>
      )}

      {callActive && (
        <div className="bg-gray-800 p-3 rounded-lg border border-green-500 mt-3">
          <div className="flex gap-3 items-center justify-between">
            <span className="text-sm text-white">Call active ({callType})</span>
            <button className="btn btn-xs btn-warning" onClick={endCall}>
              End Call
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {localStream && (
              <video
                className="w-full rounded-lg bg-black"
                autoPlay
                muted
                playsInline
                ref={(video) => {
                  if (video && localStream) video.srcObject = localStream;
                }}
              />
            )}
            {remoteStream && (
              <video
                className="w-full rounded-lg bg-black"
                autoPlay
                playsInline
                ref={(video) => {
                  if (video && remoteStream) video.srcObject = remoteStream;
                }}
              />
            )}
          </div>
        </div>
      )}

      <StatusViewer
        user={selectedConversation}
        isOpen={showStatusViewer}
        onClose={() => setShowStatusViewer(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}

export default Chatuser