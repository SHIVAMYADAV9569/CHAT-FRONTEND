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
    <div className="w-full flex flex-col bg-slate-800 text-gray-300 min-h-screen">
      <div className="border-b border-gray-700">
        <div className="flex items-center justify-between p-4 md:p-5">
          <div>
            <h2 className="text-lg md:text-xl font-bold">Messenger</h2>
            <p className="text-sm text-gray-400 md:text-base">Chat with your friends</p>
          </div>
          <button className="md:hidden text-white p-2" onClick={() => setIsSidebarOpen(true)}>
            <HiMenu className="text-2xl" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {!selectedConversation ? (
          <Nochat setIsSidebarOpen={setIsSidebarOpen} />
        ) : (
          <div className="flex h-full flex-col">
            <Chatuser isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 overflow-y-auto px-2 md:px-4" style={{ maxHeight: 'calc(100vh - 20vh)' }}>
              <Messages />
            </div>
            <Type />
          </div>
        )}
      </div>
    </div>
  );
}
export default Right;

const Nochat = ({ setIsSidebarOpen }) => {
  const { authUser } = useAuth();
  return (
    <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center gap-4">
      <button className="md:hidden text-white p-2 bg-slate-900 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
        <HiMenu className="text-2xl" />
      </button>
      <h1 className="font-semibold text-xl md:text-2xl">Welcome <span className="text-blue-400">{authUser.user.name}</span></h1>
      <p className="text-gray-400 max-w-md">Select a chat to start messaging. Use the menu icon to open profile and status controls on mobile.</p>
    </div>
  );
};
