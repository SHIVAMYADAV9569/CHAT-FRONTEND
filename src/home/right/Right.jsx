import React, { useEffect } from 'react';
import Chatuser from './Chatuser';
import Messages from './Messages';
import Type from './Type';
import useConversation from '../../statemanage/useConversation.js';
import { useAuth } from "../../context/AuthProvider.jsx";
import { HiMenu } from 'react-icons/hi';

function Right({ isSidebarOpen, setIsSidebarOpen }) {
  const { selectedConversation, setSelectedConversation } = useConversation();

  return (
    <div className="w-full bg-slate-800 text-gray-300">
      <div>
        {!selectedConversation ? (
          <Nochat isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        ) : (
          <>
            <Chatuser isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div
              className="flex-1 overflow-y-auto"
              style={{ maxHeight: "calc(92vh - 8vh)" }}
            >
              <Messages />
            </div>
            <Type />
          </>
        )}
      </div>
    </div>
  );
}
export default Right;

const Nochat = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { authUser } = useAuth();
  return (
    <div className="flex h-screen items-center justify-center relative">
      <button className="absolute top-4 left-4 md:hidden text-white p-2" onClick={() => setIsSidebarOpen(true)}>
        <HiMenu className="text-2xl" />
      </button>
      <h1 className="font-semibold text-xl">welcome <span>{authUser.user.name}</span>
       <br /> Select a chat to start messaging.
      </h1>
    </div>
  );
};
