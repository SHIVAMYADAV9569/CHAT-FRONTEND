import React, { useEffect, useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import axios from "axios";

function useGetMessage() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      //  console.log(selectedConversation?._id);
      setLoading(true);
      if (selectedConversation && selectedConversation?._id) {
        try {
          console.log(selectedConversation?._id);
          const response = await axios.get(
            `/api/message/get/${selectedConversation?._id}`
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

  return {
    messages,
    loading,
  };
}

export default useGetMessage;
