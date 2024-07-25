import React from "react";
import { useChat } from "../../hooks/useChat";
import { useAudioRecording } from "../../hooks/useAudioRecording";
import ToolbarButtons from "./ToolbarButtons";
import TextArea from "./TextArea";
import { SidebarMobileButton } from "../Sidebar/SidebarMobileButton";

export const Input: React.FC = () => {
  const { getMessages, handleAudioUpload } = useChat();
  const { isRecording, startRecording, stopRecording } = useAudioRecording(handleAudioUpload);

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
