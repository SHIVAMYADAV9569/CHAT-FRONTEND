import { useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import axios from "axios";

function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessages = async (message) => {
    if (!message.trim()) return;

    setLoading(true);
    if (selectedConversation && selectedConversation._id) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/message/send/${selectedConversation._id}`,
          { message }
        );

        setMessages({
          ...messages,
          messages: [...(messages.messages || []), response.data.newMessage],
        });
      } catch (error) {
        console.log("Error in sendMessage:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return { loading, sendMessages };
}

export default useSendMessage;
