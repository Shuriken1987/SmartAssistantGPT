import { NewChatButton } from "./NewChatButton";
import { ChatListItem } from "./ChatListItem";
import { SignIn } from "./SignIn";

export const Sidebar: React.FC = () => {
  return (
    <div
      id="application-sidebar"
      className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700"
    >
      <nav className="hs-accordion-group size-full flex flex-col"
           data-hs-accordion-always-open
      >
        <div className="flex items-center justify-between pt-4 pe-4 ps-7">
          <div>
            <h1 className="text-white text-[24px] font-bold">AI Assistant</h1>
          </div>
        </div>
        <div className="h-full">
          <ul className="space-y-1.5 p-4">
            <NewChatButton />
            <ChatListItem />
          </ul>
        </div>
        <SignIn />
      </nav>
    </div>
  );
};
