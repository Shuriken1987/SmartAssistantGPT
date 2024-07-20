import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { addChat, setCurrentTitle } from "./redux/slices/chatSlice";
import { Sidebar } from "./components/Sidebar";
import { Content } from "./components/Content";
import { Input } from "./components/Input";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { message, currentTitle, tempValue } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (!currentTitle && tempValue && message) {
      dispatch(setCurrentTitle(tempValue));
    }
    if (currentTitle && message && tempValue) {
      dispatch(addChat({ title: currentTitle, role: "user", content: tempValue }));
      dispatch(addChat({ title: currentTitle, role: "assistant", content: message.content }));
    }
  }, [message, currentTitle, tempValue, dispatch]);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="relative h-screen w-full lg:ps-64 bg-black">
        <Content />
        <Input />
      </div>
    </div>
  );
};

export default App;
