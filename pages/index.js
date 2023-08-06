import LayoutApp from "components/Layout/layoutApp";
import { ChatContext } from "components/Context/context";
import { useContext } from "react";
import ChatPage from "components/Chat/chatPage";

export default function Home() {
  const chatContext = useContext(ChatContext);

  return (
    <>
      <LayoutApp>
        {chatContext?.selectedConversation != null ? <ChatPage /> : <></>}
      </LayoutApp>
    </>
  );
}
