import { Button, Divider, Title } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { ChatContext, ChatDispatchContext } from "components/Context/context";

export default function ConversationsList() {
  const chatContext = useContext(ChatContext);
  const setChatContext = useContext(ChatDispatchContext);

  const [conversations, setConversations] = useState([]);

  function SelectConversation(id) {
    setChatContext({
      ...chatContext,
      selectedConversation: id,
    });
  }

  function CreateConversation() {
    let id = 0;
    if (conversations.length > 0) {
      id = conversations[conversations.length - 1].id + 1;
    }

    let conv = conversations;
    conv.push({
      id: id,
      name: "New conversation:  " + id,
    });
    setConversations(conv);

    setChatContext({
      ...chatContext,
      selectedConversation: id,
      conversations: conv,
    });
  }

  useEffect(() => {
    if (chatContext?.conversations != null) {
      setConversations(chatContext?.conversations);
    }
  }, [chatContext]);

  useEffect(() => {
    if (chatContext?.conversations != null) {
      setConversations(chatContext?.conversations);
    }
  });

  return (
    <>
      <Title order={3}>Conversations</Title>
      <>
        {conversations.map((conversation) => (
          <Button
            key={conversation.id}
            onClick={() => {
              SelectConversation(conversation.id);
            }}
            w="100%"
            variant={
              chatContext?.selectedConversation == conversation.id
                ? "filled"
                : "subtle"
            }
            mt={4}
          >
            {conversation.name}
          </Button>
        ))}
      </>
      <Divider mt={32} mb={32} />
      <Button onClick={CreateConversation}>New conversation ...</Button>
    </>
  );
}
