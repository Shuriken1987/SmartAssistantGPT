import { Sidebar } from "./components/Sidebar";
import { Content } from "./components/Content";
import { Input } from "./components/Input";

const App: React.FC = () => {

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
