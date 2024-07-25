import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  setMessage,
  setTempValue,
  setValue,
  addChat,
  setCurrentTitle,
} from "../redux/slices/chatSlice";

export const useChat = () => {
  const dispatch = useDispatch();
  const { value, currentTitle } = useSelector((state: RootState) => state.chat);

  const getMessages = async () => {
    if (!currentTitle) {
      dispatch(setCurrentTitle(value));
    }
    const newChatTitle = currentTitle || value;
    dispatch(addChat({ title: newChatTitle, role: "user", content: value }));
    dispatch(setValue("")); // Clear the input field after sending the message

    const options = {
      method: "POST",
      body: JSON.stringify({ message: value }),
      headers: { "Content-Type": "application/json" },
    };

    try {
      const response = await fetch("http://localhost:8000/completions", options);
      const data = await response.json();
      dispatch(addChat({ title: newChatTitle, role: data.choices[0].message.role, content: data.choices[0].message.content }));
      dispatch(setMessage(data.choices ? data.choices[0].message : ""));
      dispatch(setTempValue(value));
    } catch (error) {
      console.error("Error in getMessages:", error);
    }
  };

  const handleAudioUpload = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");

    try {
      const response = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      dispatch(setTempValue(data?.transcribedText.content));
      if (!currentTitle) {
        dispatch(setCurrentTitle(data?.transcribedText.content));
      }
      const newTitle = currentTitle || data?.transcribedText.content;
      dispatch(addChat({ title: newTitle, role: "user", content: data?.transcribedText.content }));
      dispatch(setMessage(data?.chatResponseText));
      dispatch(addChat({ title: newTitle, role: "assistant", content: data?.chatResponseText.content }));
    } catch (error) {
      console.error("Error in handleAudioUpload:", error);
    }
  };

  return {
    value,
    currentTitle,
    getMessages,
    handleAudioUpload,
  };
};
