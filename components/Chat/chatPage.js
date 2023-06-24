import { Title } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { ChatContext, ChatDispatchContext } from "components/Context/context";
import ChatTitle from "components/Chat/chatTitle";
import { getConversationindex } from "utils/conv_helpers";
import ChatForm from "components/Chat/chatForm";
import ChatHistory from "components/Chat/chatHistory";

export default function ChatPage() {
  const chatContext = useContext(ChatContext);
  const setChatContext = useContext(ChatDispatchContext);

  const [curConversation, setCurConversation] = useState(null);

  useEffect(() => {
    if (chatContext?.selectedConversation != null) {
      let indx = getConversationindex(
        chatContext?.conversations,
        chatContext?.selectedConversation
      );
      setCurConversation(chatContext?.conversations[indx]);
    }
  }, [chatContext?.selectedConversation]);

  console.log(curConversation);

  return (
    <>
      <ChatTitle conversation={curConversation} />
      <ChatHistory conversation={curConversation} />
      <ChatForm conversation={curConversation} />
    </>
  );
}
