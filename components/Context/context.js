import { createContext, useEffect, useState } from "react";

const ChatContext = createContext(undefined);
const ChatDispatchContext = createContext(undefined);

function ChatProvider({ children }) {
  const [context, setContext] = useState({
    conversations: [],
    currentConversation: null,
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem("chat_assistant");
    if (loggedInUser) {
      setContext(JSON.parse(loggedInUser));
    }
  }, []);

  useEffect(() => {
    if (context != null) {
      localStorage.setItem("chat_assistant", JSON.stringify(context));
    } else {
      localStorage.removeItem("chat_assistant");
    }
  }, [context]);

  return (
    <ChatContext.Provider value={context}>
      <ChatDispatchContext.Provider value={setContext}>
        {children}
      </ChatDispatchContext.Provider>
    </ChatContext.Provider>
  );
}

export { ChatContext, ChatDispatchContext, ChatProvider };
