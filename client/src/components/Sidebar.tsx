import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTitle, setMessage, setValue } from "../redux/slices/chatSlice";
import { RootState } from "../redux/store";

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { previousChats } = useSelector((state: RootState) => state.chat);

  const handleClick = (title: string) => {
    dispatch(setCurrentTitle(title));
    dispatch(setMessage(null));
    dispatch(setValue(""));
  };

  const createNewChat = () => {
    dispatch(setMessage(null));
    dispatch(setValue(""));
    dispatch(setCurrentTitle(""));
  };

  const uniqueTitles = Array.from(new Set(previousChats.map((previousChat) => previousChat.title)));

  return (
    <div id="application-sidebar" className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700">
      <nav className="hs-accordion-group size-full flex flex-col" data-hs-accordion-always-open>
        <div className="flex items-center justify-between pt-4 pe-4 ps-7">
          <div>
            <h1 className="text-white text-[24px] font-bold">AI Assistant</h1>
          </div>
        </div>
        <div className="h-full">
          <ul className="space-y-1.5 p-4">
            <li>
              <p className="flex items-center gap-x-3 py-2 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-300 cursor-pointer" onClick={createNewChat}>
                <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                New chat
              </p>
            </li>
            {uniqueTitles.map((uniqueTitle, index) => (
              <li key={index} onClick={() => handleClick(uniqueTitle)}>
                <p className="flex items-center gap-x-3 py-2 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-300 cursor-pointer">
                  {uniqueTitle}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto">
          <div className="py-2.5 px-7">
            <p className="inline-flex items-center gap-x-2 text-xs text-green-600">
              <span className="block size-1.5 rounded-full bg-green-600"></span>
              Active 12,320 people
            </p>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
            <a className="flex justify-between items-center gap-x-3 py-2 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-300" href="#">
              Sign in
              <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};
