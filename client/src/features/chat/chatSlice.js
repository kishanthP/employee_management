import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as chatService from "../../services/chatService";
import * as groupService from "../../services/groupService";

// Thunks
export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversations();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch conversations");
    }
  }
);

export const fetchGroups = createAsyncThunk(
  "chat/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await groupService.getGroups();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch groups");
    }
  }
);

export const fetchUnreadCounts = createAsyncThunk(
  "chat/fetchUnreadCounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getUnreadCounts();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch unread counts");
    }
  }
);

// Initial State
const initialState = {
  conversations: [], // DM list
  groups: [],        // Group list
  activeChat: null,  // { id, type: 'dm' | 'group', placeholderName, ... }
  messages: [],      // Messages for the active chat
  unreadCounts: {
    conversations: [], // [{ id, unread }]
    groups: [],        // [{ id, unread }]
  },
  onlineUsers: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      state.messages = []; // Clear old messages
    },
    setMessages: (state, action) => {
      // Used when fetching initial messages for the room
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      // Append a single new message if it belongs to the active chat
      const msg = action.payload;
      if (!state.activeChat) return;
      if (
        (msg.context === "dm" && state.activeChat.type === "dm" && state.activeChat.id === msg.conversationId) ||
        (msg.context === "group" && state.activeChat.type === "group" && state.activeChat.id === msg.groupId)
      ) {
        state.messages.push(msg);
      }
    },
    updateOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    markReadLocal: (state, action) => {
      const { id, type } = action.payload; // type: 'conversations' | 'groups'
      const item = state.unreadCounts[type].find((c) => c.id === id);
      if (item) item.unread = 0;
    },
    incrementUnread: (state, action) => {
      const { id, type } = action.payload;
      const item = state.unreadCounts[type].find((c) => c.id === id);
      if (item) {
        item.unread = Number(item.unread) + 1;
      } else {
        state.unreadCounts[type].push({ id, unread: 1 });
      }
    },
    clearChatError: (state) => {
      state.error = null;
    },
    updateLatestMessage: (state, action) => {
      const msg = action.payload;
      if (msg.context === "dm") {
        const conv = state.conversations.find(c => c.id === msg.conversationId);
        if (conv) {
          conv.last_message = msg.content;
          conv.last_message_at = msg.created_at;
        }
      } else if (msg.context === "group") {
        const group = state.groups.find(g => g.id === msg.groupId);
        if (group) {
          group.last_message = msg.content;
          group.last_message_at = msg.created_at;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Groups
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Unread Counts
      .addCase(fetchUnreadCounts.fulfilled, (state, action) => {
        state.unreadCounts = action.payload;
      });
  },
});

export const {
  setActiveChat,
  setMessages,
  addMessage,
  updateOnlineUsers,
  markReadLocal,
  incrementUnread,
  clearChatError,
  updateLatestMessage
} = chatSlice.actions;

export default chatSlice.reducer;
