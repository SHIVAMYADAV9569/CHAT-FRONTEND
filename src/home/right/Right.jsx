import React, { useEffect } from 'react';
import Chatuser from './Chatuser';
import Messages from './Messages';
import Type from './Type';
import useConversation from '../../statemanage/useConversation.js';
import { useAuth } from "../../context/AuthProvider.jsx";

function Right() {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="w-full bg-slate-800 text-gray-300">
      <div>
        {!selectedConversation ? (
          <Nochat />
        ) : (
          <>
            <Chatuser />
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

const Nochat = () => {
  const { authUser } = useAuth();
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="font-semibold text-xl">welcome <span>{authUser.user.name}</span>
       <br /> Select a chat to start messaging.
      </h1>
    </div>
  );
};
