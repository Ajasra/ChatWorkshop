import { Title } from "@mantine/core";
import LayoutApp from "components/Layout/layoutApp";
import { ChatContext, ChatDispatchContext } from "components/Context/context";
import { useContext } from "react";

const openai_key = process.env.NEXT_PUBLIC_OPANAI_API;

export default function Home() {
  const chatContext = useContext(ChatContext);
  const setChatContext = useContext(ChatDispatchContext);

  console.log(chatContext);

  return (
    <>
      <LayoutApp>
        <Title order={1}>Virtual Assistant</Title>
      </LayoutApp>
    </>
  );
}
