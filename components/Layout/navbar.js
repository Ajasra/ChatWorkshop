import { Navbar, Text, Title } from "@mantine/core";
import ConversationsList from "components/Conversations/conversationsList";

export default function Navigation(props) {
  const { opened, setOpened } = props;

  return (
    <Navbar p="md" hiddenBreakpoint="md" hidden={!opened} width={{ base: 400 }}>
      <ConversationsList />
    </Navbar>
  );
}
