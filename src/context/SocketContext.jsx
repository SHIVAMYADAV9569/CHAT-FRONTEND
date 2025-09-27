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

    // naya socket banाओ
    const newSocket = io("http://localhost:5002", {
      query: { userId: authUser.user._id },
    });

    setSocket(newSocket);

    // online users update
    newSocket.on("getonline", (users) => {
      setOnlineUsers(users);
      console.log("Online users:", users);
    });

    // cleanup
    return () => {
      newSocket.close();
      setSocket(null);
      setOnlineUsers([]);
      console.log("Socket disconnected (cleanup)");
    };
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
