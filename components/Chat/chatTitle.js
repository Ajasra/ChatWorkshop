import { Button, Group, Input, Title, Tooltip } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import {
  CheckIcon,
  Cross1Icon,
  CrumpledPaperIcon,
  ResetIcon,
} from "@radix-ui/react-icons";
import { ChatContext, ChatDispatchContext } from "components/Context/context";
import { getConversationindex } from "utils/conv_helpers";

export default function ChatTitle(props) {
  const { conversation } = props;

  const chatContext = useContext(ChatContext);
  const setChatContext = useContext(ChatDispatchContext);

  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");

  function updateTitle() {
    setTitle(newTitle);

    let tmp = chatContext.conversations;
    let indx = getConversationindex(tmp, chatContext.selectedConversation);

    tmp[indx].name = newTitle;
    setChatContext({
      ...chatContext,
      conversations: tmp,
    });
  }

  function deleteConversation() {
    let tmp = chatContext.conversations;
    let indx = getConversationindex(tmp, chatContext.selectedConversation);
    tmp.splice(indx, 1);
    setChatContext({
      ...chatContext,
      conversations: tmp,
      selectedConversation: null,
    });
  }

  function closeConversation() {
    setChatContext({
      ...chatContext,
      selectedConversation: null,
    });
  }

  useEffect(() => {
    if (conversation != null) {
      setTitle(conversation.name);
      setNewTitle(conversation.name);
    }
  }, [conversation]);

  return (
    <div style={{ position: "relative" }}>
      <Group
        sx={(theme) => ({
          position: "absolute",
          right: "2em",
          top: "1em",
          zIndex: "1",
          "@media (max-width: 48em)": {
            top: "0em",
            right: "-1em",
          },
        })}
      >
        {title != newTitle && (
          <>
            <Button onClick={updateTitle} variant="Unstyled">
              <Tooltip label="Update title">
                <CheckIcon />
              </Tooltip>
            </Button>
            <Button onClick={() => setNewTitle(title)} variant="Unstyled">
              <Tooltip label="Cancel changes">
                <ResetIcon />
              </Tooltip>
            </Button>
          </>
        )}
        <Button onClick={deleteConversation} variant="Unstyled">
          <Tooltip label="Delete conversation">
            <CrumpledPaperIcon />
          </Tooltip>
        </Button>
        <Button onClick={closeConversation} variant="Unstyled">
          <Tooltip label="Close conversation">
            <Cross1Icon />
          </Tooltip>
        </Button>
      </Group>
      <Input
        value={newTitle}
        variant="unstyled"
        size="xl"
        onChange={(event) => setNewTitle(event.target.value)}
        sx={(theme) => ({
          maxWidth: "65%",
          "@media (max-width: 48em)": {
            paddingTop: "2em",
            maxWidth: "100%",
          },
        })}
      />
    </div>
  );
}
