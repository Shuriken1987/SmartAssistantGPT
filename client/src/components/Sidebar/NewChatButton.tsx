import { useDispatch } from "react-redux";
import { setCurrentTitle, setMessage, setValue } from "../../redux/slices/chatSlice";

export const NewChatButton: React.FC = () => {
    const dispatch = useDispatch();

    const createNewChat = () => {
        dispatch(setMessage(null));
        dispatch(setValue(""));
        dispatch(setCurrentTitle(""));
      };
  return (
    <li>
    <p className="flex items-center gap-x-3 py-2 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-300 cursor-pointer"
       onClick={createNewChat}>
      <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
      New chat
    </p>
  </li>
  )
}
