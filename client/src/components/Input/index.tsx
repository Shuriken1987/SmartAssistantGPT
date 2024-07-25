import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  setMessage,
  setTempValue,
  setValue,
  addChat,
  setCurrentTitle,
} from "../../redux/slices/chatSlice";
import ToolbarButtons from "./ToolbarButtons";
import TextArea from "./TextArea";
import { SidebarMobileButton } from "../Sidebar/SidebarMobileButton";

export const Input: React.FC = () => {
  const dispatch = useDispatch();
  const { value, currentTitle } = useSelector((state: RootState) => state.chat); // Importing value from Redux store
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>( null );

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        await handleAudioUpload(audioBlob);
      };

      recorder.start();
    } catch (error) {
      console.error("Error accessing audio device:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder?.stop();
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
      dispatch(
        addChat({
          title: newTitle,
          role: "user",
          content: data?.transcribedText.content,
        })
      ); // User transcribed text response
      dispatch(setMessage(data?.chatResponseText));
      dispatch(
        addChat({
          title: newTitle,
          role: "assistant",
          content: data?.chatResponseText.content,
        })
      ); // Chatbot response
    } catch (error) {
      console.error("Error in handleAudioUpload:", error);
    }
  };

  const getMessages = async () => {
    // Immediately update the chat with the user's input
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
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      dispatch(
        addChat({
          title: newChatTitle,
          role: data.choices[0].message.role,
          content: data.choices[0].message.content,
        })
      ); // Check for undefined
      dispatch(setMessage(data.choices ? data.choices[0].message : "")); // Check for undefined
      dispatch(setTempValue(value));
    } catch (error) {
      console.error("Error in getMessages:", error);
    }
  };

  return (
    <>
      <footer className="max-w-4xl mx-auto sticky bottom-0 z-10 p-3 sm:py-6">
        <SidebarMobileButton />
        <div className="relative">
          <TextArea />
          <ToolbarButtons
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            getMessages={getMessages}
          />
        </div>
      </footer>
    </>
  );
};
