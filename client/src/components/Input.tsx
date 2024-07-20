import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setMessage, setTempValue, setValue } from "../redux/slices/chatSlice";

export const Input: React.FC = () => {
  const dispatch = useDispatch();
  const { value } = useSelector((state: RootState) => state.chat);
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
      {/* <!-- Textarea --> */}
      <footer className="max-w-4xl mx-auto sticky bottom-0 z-10 p-3 sm:py-6">
        <div className="lg:hidden flex justify-end mb-2 sm:mb-3">
          {/* <!-- Sidebar Toggle --> */}
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
          {/* <!-- End Sidebar Toggle --> */}
        </div>

        {/* <!-- Input --> */}
        <div className="relative">
          <textarea
            className="p-4 pb-12 block w-full bg-gray-100 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Ask me anything..."
            value={value}
            onChange={(e) => dispatch(setValue(e.target.value))}
          />

          {/* <!-- Toolbar --> */}
          <div className="absolute bottom-px inset-x-px p-2 rounded-b-lg bg-gray-100 dark:bg-neutral-800">
            <div className="flex justify-between items-center">
              {/* <!-- Button Group --> */}
              <div className="flex items-center">
                {/* <!-- Mic Button --> */}
                <button
                  type="button"
                  className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:text-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-500 dark:hover:text-blue-500"
                >
                  <svg
                    className="flex-shrink-0 size-4"
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
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <line x1="9" x2="15" y1="15" y2="9" />
                  </svg>
                </button>
                {/* <!-- End Mic Button --> */}

                {/* <!-- Attach Button --> */}
                <button
                  type="button"
                  className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:text-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-500 dark:hover:text-blue-500"
                >
                  <svg
                    className="flex-shrink-0 size-4"
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
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                {/* <!-- End Attach Button --> */}
              </div>
              {/* <!-- End Button Group --> */}

              {/* <!-- Button Group --> */}
              <div className="flex items-center gap-x-1">
                {/* <!-- Mic Button --> */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  type="button"
                  className={`inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:text-blue-600 focus:z-10 focus:outline-none ${!isRecording ? "dark:text-neutral-500 dark:hover:text-green-600" : "dark:text-red-600 dark:hover:text-red-500"}  `}
                >
                  <svg
                    className="flex-shrink-0 size-4"
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
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </button>
                {/* <!-- End Mic Button --> */}
                {/* <!-- Send Button --> */}
                <button
                  type="button"
                  className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={getMessages}
                >
                  <svg
                    className="flex-shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                  </svg>
                </button>
                {/* <!-- End Send Button --> */}
              </div>
              {/* <!-- End Button Group --> */}
            </div>
          </div>
          {/* <!-- End Toolbar --> */}
        </div>
        {/* <!-- End Input --> */}
      </footer>
      {/* <!-- End Textarea --> */}
    </>
  );
};
