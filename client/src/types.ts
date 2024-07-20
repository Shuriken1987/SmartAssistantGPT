  export interface ChatMessage {
    title: string;
    role: string;
    content: string;
  }

  export interface ChatState {
    value: string;
    message: ChatMessage | null;
    previousChats: { title: string; role: string; content: string }[];
    currentTitle: string;
    tempValue: string;
  }

  export interface ToolbarButtonsProps {
    isRecording: boolean;
    startRecording: () => void;
    stopRecording: () => void;
    getMessages: () => void;
  }