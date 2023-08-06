import { Button, Container, Group, Input, Loader, Title } from "@mantine/core";
import { useContext, useState } from "react";
import { ChatContext, ChatDispatchContext } from "components/Context/context";
import { ShowError, ShowInfo, ShowSuccess } from "utils/notifications";
import { getConversationindex } from "utils/conv_helpers";
import GenerateVideo from "components/Chat/GenerateVideo";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API;
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

import styles from "styles/Chat.module.css";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatForm(props) {
  const { conversation } = props;

  const chatContext = useContext(ChatContext);
  const setChatContext = useContext(ChatDispatchContext);

  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [genVideo, setGenVideo] = useState(false);
  const [answer, setAnswer] = useState('')

  async function playSound(file) {
    setProcessing(true);
    await delay(1500);
    const audioElement = new Audio(file);
    // setSpeechFile(audioElement);

    audioElement.addEventListener("canplaythrough", () => {
      audioElement.play();
    });

    audioElement.addEventListener("ended", () => {
      setProcessing(false);
    });
  }

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
          setChatContext({
            ...chatContext,
            conversations: conv,
            action: "update history",
          });
          setProcessing(false);
          setQuestion("");
          return json.response;
        }
      } catch (e) {
        console.error(e);
        setProcessing(false);
        setQuestion("");
        return null;
      }
    }
    return null;
  }

  async function getVoice() {
    const resp_text = await getResponse();
    if (resp_text == null) {
      return;
    }
    ShowSuccess("Text response generated");

    setProcessing(true);
    let api_url = "/api/elevenlabs";
    if (BACKEND_URL !== undefined) {
      api_url = `${BACKEND_URL}/elevenlabs`;
    }
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ messages: resp_text, key: LOCAL_KEY }),
    });

    ShowInfo("Generating speech");

    const json = await response
      .json()
      .catch((err) => {
        console.error(err);
        setProcessing(false);
        ShowError("Error", "Cant generate speech");
      })
      .then(async (res) => {
        if (res.error === null) {
          const s_id = res.response;
          await playSound(`/resp/r_${s_id}.mp3`);
        }
      });
  }

  async function getVideo() {
    
    const resp_text = await getResponse();
    if (resp_text == null) {
      return;
    }
    ShowSuccess("Text response generated");
    setProcessing(true);
    ShowInfo("Generating video");
    setAnswer(resp_text);
    setGenVideo(true);
  }

  return (
    <Container className={styles.chat_form}>
      <GenerateVideo genVideo={genVideo} setGenVideo={setGenVideo} text={answer} updProcessing={setProcessing} />
      {/*<Title order={4}>Ask a question</Title>*/}
      <Input
        label="Your question"
        placeholder="What is the meaning of life?"
        required
        variant="filled"
        size="md"
        value={question}
        mt={4}
        error={questionError}
        onChange={(event) => setQuestion(event.target.value)}
      />
      <Group>
        <Button onClick={getResponse} mt={8} disabled={processing}>
          {processing ? <Loader size="sm" /> : "Ask"}
        </Button>
        <Button onClick={getVoice} mt={8} disabled={processing}>
          {processing ? <Loader size="sm" /> : "Voice"}
        </Button>
        <Button onClick={getVideo} mt={8} disabled={processing}>
          {processing ? <Loader size="sm" /> : "Video"}
        </Button>
      </Group>
    </Container>
  );
}
