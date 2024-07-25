import { useState } from "react";

export const useAudioRecording = (handleAudioUpload: (audioBlob: Blob) => Promise<void>) => {
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

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};
