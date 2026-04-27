import React from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
function Chatuser() {
 const {selectedConversation} = useConversation()
  console.log(selectedConversation);
  const {onlineUsers} =useSocketContext();
 const getOnlineUserStatus = (user) =>{
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

  return (
    <>
    <div className="flex space-x-4 pl-5 pt-0 pb-3 h-[8vh] bg-gray-900 hover:bg-gray-600 duration-300 cursor-pointer">
      <div>
        {/* <div className={`avatar ${isOnline ? "online" : ""}`} > */}
        <div className={`avatar online`} >
          <div className="w-14 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
          </div>
        </div>
        </div>

        <div>
          <h1 className="text-xl">{selectedConversation?.name}</h1>
          <span className="text-sm text-gray-500">{getOnlineUserStatus(selectedConversation)}</span>
        </div>
        </div>
    </>
  )
}

export default Chatuser