import { Button, Container, Input, Loader, Title } from "@mantine/core";
import { useContext, useState } from "react";
import { ChatContext, ChatDispatchContext } from "components/Context/context";
import { ShowInfo } from "utils/notifications";
import { getConversationindex } from "utils/conv_helpers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API;
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

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

      try {
        let api_url = "/api/get_response";
        if (BACKEND_URL !== undefined) {
          api_url = `${BACKEND_URL}/get_response`;
        }

        let history = [];
        if (conversation.history != null) {
          history = conversation.history;
        }

        const response = await fetch(api_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            history: history,
            api_key: LOCAL_KEY,
            question: question,
          }),
        });

        const json = await response.json().catch((err) => {
          console.error(err);
          setProcessing(false);
        });

        if (json.code == 200) {
          let conv = chatContext?.conversations;
          let indx = getConversationindex(conv, conversation.id);
          let history = [];
          if (conv[indx]?.history != null) {
            history = conv[indx].history;
          }
          history.push({
            question: question,
            response: json.response,
          });
          conv[indx].history = history;
          setChatContext({ ...chatContext, conversations: conv });
        }
      } catch (e) {
        console.log(e);
      }

      setProcessing(false);
      setQuestion('');
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
