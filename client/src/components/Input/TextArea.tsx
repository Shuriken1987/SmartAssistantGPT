import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setValue } from "../../redux/slices/chatSlice";

const TextArea: React.FC = () => {
  const dispatch = useDispatch();
  const { value } = useSelector((state: RootState) => state.chat);

  const autoResize = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setValue(e.target.value));
  };

  return (
    <textarea
      className="p-4 pb-12 block w-full bg-gray-100 border-gray-200 outline-none rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 resize-none overflow-y-hidden"
      placeholder="Ask me anything..."
      onInput={autoResize}
      value={value}
      onChange={handleChange}
      style={{ resize: 'none', overflowY: 'hidden' }}
    />
  );
};

export default TextArea;
