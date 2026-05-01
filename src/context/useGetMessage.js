import React, { useEffect, useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import axios from "axios";
import useUsersStore from "../statemanage/useUsersStore.js";

function useGetMessage() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const setUnreadCount = useUsersStore((state) => state.setUnreadCount);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      if (selectedConversation && selectedConversation?._id) {
        try {
          console.log(selectedConversation?._id);
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/message/get/${selectedConversation?._id}`
          );
          setMessages({
            ...response.data,
            selectedConversation: selectedConversation
          });
          // Mark unread as 0 for this user
          setUnreadCount(selectedConversation._id, 0);
          setLoading(false);
        } catch (error) {
          console.log(" Error in useGetMessage:", error);
          setLoading(false);
        }
      }
    };
    getMessages();
  }, [selectedConversation, setMessages, setUnreadCount]);

  return {
    messages,
    loading,
  };
}

export default useGetMessage;
