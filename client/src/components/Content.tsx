import { useSelector } from "react-redux";
import assistantImage from '../assets/logo-white.png';
import { RootState } from "../redux/store";

export const Content: React.FC = () => {
  const { previousChats, currentTitle } = useSelector((state: RootState) => state.chat);

  const currentChat = previousChats.filter((previousChat) => previousChat.title === currentTitle);

  return (
    <div className="py-10 lg:py-14">
      <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">Welcome to AI Assistant</h1>
        <p className="mt-3 text-gray-600 dark:text-neutral-400">Your AI-powered copilot for the web</p>
        <p className="mt-3 text-gray-600 dark:text-neutral-400">Made by Milan Stanojevic</p>
      </div>
      <ul className="mt-16 space-y-5">
        <div>
          {currentChat.map((chatMessage, index) => (
            <li key={index} className="py-2 sm:py-4">
              <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
                <div className="max-w-2xl flex gap-x-2 sm:gap-x-4">
                  <span className="flex-shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-400">
                    <span className="text-sm font-medium text-white leading-none">
                      {chatMessage.role === "assistant" ? (
                        <img src={assistantImage} alt="assistant image" />
                      ) : (
                        chatMessage.role
                      )}
                    </span>
                  </span>
                  <div className="grow mt-2 space-y-3">
                    <p className="text-gray-800 dark:text-neutral-200">{chatMessage.content}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};
