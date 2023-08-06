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

import styles from "styles/Chat.module.css";

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
    <div className={styles.chat_title}>
      <Group
        sx={(theme) => ({
          position: "absolute",
          right: "2em",
          top: "0em",
          zIndex: "1",
          "@media (max-width: 48em)": {
            top: "0em",
            right: "-1em",
          },
        })}
      >
        <div className={styles.chat_title_edit}>
          {title != newTitle && (
            <>
              <Button
                onClick={updateTitle}
                variant="Unstyled"
                className={styles.chat_title_button}
              >
                <Tooltip label="Update title">
                  <CheckIcon />
                </Tooltip>
              </Button>
              <Button
                onClick={() => setNewTitle(title)}
                variant="Unstyled"
                className={styles.chat_title_button}
              >
                <Tooltip label="Cancel changes">
                  <ResetIcon />
                </Tooltip>
              </Button>
            </>
          )}
          <Button
            onClick={deleteConversation}
            variant="Unstyled"
            className={styles.chat_title_button}
          >
            <Tooltip label="Delete conversation">
              <CrumpledPaperIcon />
            </Tooltip>
          </Button>
          <Button
            onClick={closeConversation}
            variant="Unstyled"
            className={styles.chat_title_button}
          >
            <Tooltip label="Close conversation">
              <Cross1Icon />
            </Tooltip>
          </Button>
        </div>
      </Group>
      <Input
        value={newTitle}
        variant="unstyled"
        size="md"
        onChange={(event) => setNewTitle(event.target.value)}
        className={styles.chat_title_text}
      />
    </div>
  );
}
