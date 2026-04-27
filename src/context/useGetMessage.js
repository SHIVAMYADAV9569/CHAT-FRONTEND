import React, { useEffect, useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import axios from "axios";
import { useSocketContext } from "./SocketContext.jsx";

function useGetMessage() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { socket } = useSocketContext();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      if (selectedConversation && selectedConversation?._id) {
        try {
          console.log(selectedConversation?._id);
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/message/get/${selectedConversation?._id}`
          );
          setMessages(response.data);
          setLoading(false);
        } catch (error) {
          console.log(" Error in useGetMessage:", error);
          setLoading(false);
        }
      }
    };
    getMessages();
  }, [selectedConversation, setMessages]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        if (selectedConversation && (newMessage.senderId === selectedConversation._id || newMessage.receiverId === selectedConversation._id)) {
          setMessages((prevMessages) => ({
            ...prevMessages,
            messages: [...(prevMessages.messages || []), newMessage],
          }));
        }
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, selectedConversation, setMessages]);

  return {
    messages,
    loading,
  };
}

export default useGetMessage;
