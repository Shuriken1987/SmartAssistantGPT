import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { RootState } from "../redux/store";
import { setCurrentTitle, setMessage, setValue } from "../redux/slices/chatSlice";
import { useDispatch } from "react-redux";
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from "vitest";
import { ChatListItem } from "../components/Sidebar/ChatListItem";

vi.mock("react-redux", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useDispatch: vi.fn(),
  };
});

const mockStore = configureStore<RootState>([]);

describe("ChatListItem", () => {
  let store: ReturnType<typeof mockStore>;
  let dispatchMock: Mock;

  beforeEach(() => {
    const initialState: RootState = {
      chat: {
        value: "",
        message: null,
        previousChats: [
          { title: "Chat 1", role: "user", content: "Hello" },
          { title: "Chat 2", role: "user", content: "Hi" },
          { title: "Chat 1", role: "assistant", content: "Hello, how can I help you?" },
        ],
        currentTitle: "",
        tempValue: "",
      },
    };

    store = mockStore(initialState);
    dispatchMock = vi.fn();
    (useDispatch as any).mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render list items based on unique titles from previousChats", () => {
    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    expect(screen.getByText("Chat 1")).toBeInTheDocument();
    expect(screen.getByText("Chat 2")).toBeInTheDocument();
  });

  it("should dispatch setCurrentTitle with the correct title on list item click", () => {
    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    const chatItem = screen.getByText("Chat 1");
    fireEvent.click(chatItem);

    expect(dispatchMock).toHaveBeenCalledWith(setCurrentTitle("Chat 1"));
  });

  it("should dispatch setMessage with null on list item click", () => {
    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    const chatItem = screen.getByText("Chat 1");
    fireEvent.click(chatItem);

    expect(dispatchMock).toHaveBeenCalledWith(setMessage(null));
  });

  it("should dispatch setValue with an empty string on list item click", () => {
    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    const chatItem = screen.getByText("Chat 1");
    fireEvent.click(chatItem);

    expect(dispatchMock).toHaveBeenCalledWith(setValue(""));
  });

  it("should apply correct CSS classes to list items for styling", () => {
    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    const chatItem = screen.getByText("Chat 1");
    expect(chatItem).toHaveClass("flex items-center gap-x-3 py-2 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-300 cursor-pointer");
  });

  // Edge case tests
  it("should handle empty previousChats array without errors", () => {
    store = mockStore({
      chat: {
        value: "",
        message: null,
        previousChats: [],
        currentTitle: "",
        tempValue: "",
      },
    });

    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    expect(screen.queryByText("Chat 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Chat 2")).not.toBeInTheDocument();
  });

  it("should handle previousChats with special characters in titles", () => {
    store = mockStore({
      chat: {
        value: "",
        message: null,
        previousChats: [
          { title: "Chat @#$%^&*()", role: "user", content: "Hello" },
          { title: "Chat with emoji 😊", role: "user", content: "Hi" },
        ],
        currentTitle: "",
        tempValue: "",
      },
    });

    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    expect(screen.getByText("Chat @#$%^&*()")).toBeInTheDocument();
    expect(screen.getByText("Chat with emoji 😊")).toBeInTheDocument();
  });

  it("should handle previousChats with very long titles", () => {
    const longTitle = "Chat " + "A".repeat(1000);
    store = mockStore({
      chat: {
        value: "",
        message: null,
        previousChats: [
          { title: longTitle, role: "user", content: "Hello" },
        ],
        currentTitle: "",
        tempValue: "",
      },
    });

    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  // it("should handle previousChats with null or undefined titles", () => {
  //   store = mockStore({
  //     chat: {
  //       value: "",
  //       message: null,
  //       previousChats: [
  //         { title: null as any, role: "user", content: "Hello" },
  //         { title: undefined as any, role: "user", content: "Hi" },
  //       ],
  //       currentTitle: "",
  //       tempValue: "",
  //     },
  //   });

  //   render(
  //     <Provider store={store}>
  //       <ChatListItem />
  //     </Provider>
  //   );

  //   // Ensure that null and undefined titles do not create list items
  //   expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  // });

  // Structural and other tests
  it("should verify correct number of list items", () => {
    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    const chatItems = screen.getAllByRole("listitem");
    expect(chatItems.length).toBe(2);
  });

  it("should ensure handleClick function is called with correct arguments", () => {
    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    const chatItem = screen.getByText("Chat 1");
    fireEvent.click(chatItem);

    expect(dispatchMock).toHaveBeenCalledWith(setCurrentTitle("Chat 1"));
    expect(dispatchMock).toHaveBeenCalledWith(setMessage(null));
    expect(dispatchMock).toHaveBeenCalledWith(setValue(""));
  });

  it("should check if useSelector correctly extracts state from RootState", () => {
    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    expect(screen.getByText("Chat 1")).toBeInTheDocument();
    expect(screen.getByText("Chat 2")).toBeInTheDocument();
  });

  it("should validate that uniqueTitles array contains only unique values", () => {
    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    const chatItems = screen.getAllByRole("listitem");
    const titles = chatItems.map(item => item.textContent);
    const uniqueTitles = Array.from(new Set(titles));

    expect(titles.length).toBe(uniqueTitles.length);
  });

  it("should confirm that dispatch is called the expected number of times", () => {
    render(
      <Provider store={store}>
        <ChatListItem />
      </Provider>
    );

    const chatItem = screen.getByText("Chat 1");
    fireEvent.click(chatItem);

    expect(dispatchMock).toHaveBeenCalledTimes(3);
  });
});
