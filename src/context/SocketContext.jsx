import { useContext, useState, useEffect, createContext } from "react";
import { useAuth } from "./AuthProvider.jsx";
import io from "socket.io-client";

const socketContext = createContext();

export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userUpdates, setUserUpdates] = useState(null);
  const { authUser } = useAuth();

  useEffect(() => {
    if (!authUser) {
      // agar user logout ho gaya to socket close karo
      if (socket) {
        socket.close();
        setSocket(null);
        setOnlineUsers([]);
        console.log("Socket disconnected (no authUser)");
      }
      return;
    }

    console.log("Creating socket connection for user:", authUser.user._id);

    // naya socket banाओ
    const newSocket = io(`${import.meta.env.VITE_BASE_URL}`, {
      query: { userId: authUser.user._id },
    });

    // Socket event listeners
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      if (authUser?.user?._id) {
        newSocket.emit("join", authUser.user._id);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // online users update
    newSocket.on("getonline", (users) => {
      setOnlineUsers(users);
      console.log("Online users:", users);
    });

    // user profile/status update
    newSocket.on("userUpdated", (data) => {
      setUserUpdates(data);
      console.log("User updated:", data);
    });

    setSocket(newSocket);

    // cleanup
    return () => {
      console.log("Cleaning up socket connection");
      newSocket.close();
      setSocket(null);
      setOnlineUsers([]);
      console.log("Socket disconnected (cleanup)");
    };
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers, userUpdates }}>
      {children}
    </socketContext.Provider>
  );
};
