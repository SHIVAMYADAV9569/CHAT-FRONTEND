import React, { useEffect, useRef } from 'react'
import { useSocketContext } from './SocketContext.jsx'
import useConversation from '../statemanage/useConversation.js';
import useUsersStore from '../statemanage/useUsersStore.js';
import sound from "../assets/notification.mp4"

function useGetSocketMessage() {
    const {socket}=useSocketContext()
    const {messages,setMessages,selectedConversation} = useConversation();
    const incrementUnread = useUsersStore((state) => state.incrementUnread);
    const audioRef = useRef(null);

    useEffect(() => {
        // Create audio instance once
        audioRef.current = new Audio(sound);
        audioRef.current.volume = 0.3; // Set volume to 30%
    }, []);

    useEffect(()=>{
        if (!socket) {
            console.log("No socket available");
            return;
        }

        console.log("Setting up socket message listener");

        const handleNewMessage = (newMessage) => {
            console.log("🔔 RECEIVED NEW MESSAGE:", newMessage);
            console.log("Current selectedConversation:", selectedConversation);

            // Always play notification sound for any new message
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            }

            // Check if this message belongs to the currently selected conversation
            const isForCurrentConversation = selectedConversation &&
                (newMessage.senderId === selectedConversation._id ||
                 newMessage.receiverId === selectedConversation._id);

            console.log("Is message for current conversation?", isForCurrentConversation);

            if (isForCurrentConversation) {
                console.log("✅ Adding message to current conversation");

                // Add message to current conversation state
                setMessages((prevMessages) => {
                    const updatedMessages = {
                        ...prevMessages,
                        messages: [...(prevMessages.messages || []), newMessage],
                        selectedConversation: selectedConversation
                    };
                    console.log("Updated messages state:", updatedMessages);
                    return updatedMessages;
                });
            } else {
                console.log("📨 Message received but not for current conversation - updating unread badge");
                incrementUnread(newMessage.senderId);
            }
        };

        socket.on("newMessage", handleNewMessage);
        console.log("Socket listener for 'newMessage' registered");

        return () => {
            console.log("Removing socket listener for 'newMessage'");
            socket.off("newMessage", handleNewMessage);
        };
    },[socket, selectedConversation]);

    return null;
}

export default useGetSocketMessage