import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  addMessage,
  updateOnlineUsers,
  fetchUnreadCounts,
  fetchConversations,
  fetchGroups,
  updateLatestMessage
} from "../features/chat/chatSlice";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user) return;

    // Connect to Socket.IO server
    const newSocket = io(import.meta.env.VITE_API_BASE_URL.replace("/api", ""), {
      auth: { token },
    });

    setSocket(newSocket);

    // Initial data fetch on connect
    newSocket.on("connect", () => {
      dispatch(fetchUnreadCounts());
      dispatch(fetchConversations());
      dispatch(fetchGroups());
    });

    newSocket.on("online_users", (users) => {
      dispatch(updateOnlineUsers(users));
    });

    newSocket.on("new_message", (message) => {
      // Add message to active chat if applicable
      dispatch(addMessage(message));
      // Update the latest message preview in the list
      dispatch(updateLatestMessage(message));
    });

    newSocket.on("notification", (notif) => {
      // Increment unread count globally
      dispatch(fetchUnreadCounts()); // or increment manually
      
      // Update list previews
      dispatch(fetchConversations());
      dispatch(fetchGroups());

      // Show toast
      if (notif.type === "new_message" || notif.type === "new_group_message") {
        toast(`New message from ${notif.senderName}: ${notif.preview}`, {
          icon: '💬',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    });

    newSocket.on("error", (err) => {
      toast.error(err.message || "Socket error");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token, user, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
