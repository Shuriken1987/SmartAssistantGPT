import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage, ChatState } from "../../types";

const initialState: ChatState = {
  value: "",
  message: null,
  previousChats: [],
  currentTitle: "",
  tempValue: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setValue(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    setMessage(state, action: PayloadAction<ChatMessage | null>) {
      state.message = action.payload;
    },
    setPreviousChats(state, action: PayloadAction<{ title: string; role: string; content: string }[]>) {
      state.previousChats = action.payload;
    },
    setCurrentTitle(state, action: PayloadAction<string>) {
      state.currentTitle = action.payload;
    },
    setTempValue(state, action: PayloadAction<string>) {
      state.tempValue = action.payload;
    },
    addChat(state, action: PayloadAction<{ title: string; role: string; content: string }>) {
      state.previousChats.push(action.payload);
    },
  },
});

export const {
  setValue,
  setMessage,
  setPreviousChats,
  setCurrentTitle,
  setTempValue,
  addChat,
} = chatSlice.actions;

export default chatSlice.reducer;
