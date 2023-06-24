import { Button, Container, Input, Loader, Title } from "@mantine/core";
import { useContext, useState } from "react";
import { ChatContext, ChatDispatchContext } from "components/Context/context";
import { ShowInfo } from "utils/notifications";
import { getConversationindex } from "utils/conv_helpers";

export default function ChatForm(props) {
  const { conversation } = props;

  const chatContext = useContext(ChatContext);
  const setChatContext = useContext(ChatDispatchContext);

  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [processing, setProcessing] = useState(false);

  async function getResponse() {
    let continueRequest = true;

    if (question == "") {
      setQuestionError("Please enter a question");
      continueRequest = false;
      return;
    } else {
      setQuestionError("");
    }

    if (continueRequest) {
      setProcessing(true);
      ShowInfo("Please wait", "Getting response...");

      let conv = chatContext?.conversations;
      let indx = getConversationindex(conv, conversation.id);
      let history = [];
      if (conv[indx]?.history != null) {
        history = conv[indx].history;
      }
      history.push({
        question: question,
        response: "Loading...",
      });
      conv[indx].history = history;
      setChatContext({ ...chatContext, conversations: conv });

      setProcessing(false);
    }
  }

  return (
    <Container mt={32}>
      <Title order={3}>Ask a question</Title>
      <Input
        label="Your question"
        placeholder="What is the meaning of life?"
        required
        variant="filled"
        size="lg"
        value={question}
        mt={16}
        error={questionError}
        onChange={(event) => setQuestion(event.target.value)}
      />
      <Button onClick={getResponse} mt={16} disabled={processing}>
        {processing ? <Loader size="sm" /> : "Ask"}
      </Button>
    </Container>
  );
}
