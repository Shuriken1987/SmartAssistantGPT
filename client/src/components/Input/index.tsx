import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setMessage, setTempValue, setValue } from "../../redux/slices/chatSlice";
import ToolbarButtons from "./ToolbarButtons";
import TextArea from "./TextArea";

export const Input: React.FC = () => {
  const dispatch = useDispatch();
  const { value } = useSelector((state: RootState) => state.chat);  // Importing value from Redux store
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

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
      dispatch(setMessage(data?.chatResponseText));
    } catch (error) {
      console.error("Error in handleAudioUpload:", error);
    }
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({ message: value }),
      headers: { "Content-Type": "application/json" },
    };

    try {
      const response = await fetch("http://localhost:8000/completions", options);
      const data = await response.json();
      dispatch(setMessage(data.choices ? data.choices[0].message : "")); // Check for undefined
      dispatch(setTempValue(value));
      dispatch(setValue("")); // Clear the input field after sending the message
    } catch (error) {
      console.error("Error in getMessages:", error);
    }
  };

  return (
    <>
      <footer className="max-w-4xl mx-auto sticky bottom-0 z-10 p-3 sm:py-6">
        {/* Sidebar Button Mobile */}
        <div className="lg:hidden flex justify-end mb-2 sm:mb-3">
          <button
            type="button"
            className="p-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
            data-hs-overlay="#application-sidebar"
            aria-controls="application-sidebar"
            aria-label="Toggle navigation"
          >
            <svg
              className="flex-shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
            <span>Sidebar</span>
          </button>
        </div>
        {/* End Sidebar Button Mobile */}

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
