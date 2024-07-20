import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setCurrentTitle, setMessage, setValue } from "../../redux/slices/chatSlice";

export const ChatListItem: React.FC = () => {
  const dispatch = useDispatch();
  const { previousChats } = useSelector((state: RootState) => state.chat);

  const handleClick = (title: string) => {
    dispatch(setCurrentTitle(title));
    dispatch(setMessage(null));
    dispatch(setValue(""));
  };

  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );
  return (
    <>
      {uniqueTitles.map((uniqueTitle, index) => (
        <li key={index} onClick={() => handleClick(uniqueTitle)}>
          <p className="flex items-center gap-x-3 py-2 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-300 cursor-pointer">
            {uniqueTitle}
          </p>
        </li>
      ))}
    </>
  );
};
