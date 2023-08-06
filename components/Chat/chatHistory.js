import { Container, Title, Text, Button } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { PlayIcon } from "@radix-ui/react-icons";
import { ChatContext, ChatDispatchContext } from "components/Context/context";
import { getConversationindex } from "utils/conv_helpers";
import ReactMarkdown from "react-markdown";

import AudioPlayer from "utils/audioplayer";

const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatHistory(props) {
  const { conversation } = props;

  const chatContext = useContext(ChatContext);
  const setChatContext = useContext(ChatDispatchContext);

  const [speechFile, setSpeechFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState([]);

  async function playSound(file) {
    setProcessing(true);
    await delay(1500);
    const audioElement = new Audio(file);
    setSpeechFile(audioElement);

    audioElement.addEventListener("canplaythrough", () => {
      audioElement.play();
    });

    audioElement.addEventListener("ended", () => {
      setProcessing(false);
    });
  }

  async function generateSpeech(text, id) {
    setProcessing(true);
    setSpeechFile(null);

    let conversation = chatContext.conversations;
    let indx = getConversationindex(conversation, props.conversation.id);
    let history = conversation[indx].history;
    let histInd = history.length - id - 1;

    let api_url = "/api/elevenlabs";
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ messages: text, key: LOCAL_KEY }),
    });

    const json = await response
      .json()
      .catch((err) => {
        console.error(err);
        setProcessing(false);
      })
      .then(async (res) => {
        if (res.error === null) {
          const s_id = res.response;
          history[histInd] = {
            ...history[histInd],
            speech: `/resp/r_${s_id}.mp3`,
          };
          conversation[indx].history = history;
          setChatContext({
            ...chatContext,
            conversations: conversation,
            action: "update history",
          });
          await playSound(`/resp/r_${s_id}.mp3`);
        }
      });
  }

  function updateConversationHistory() {
    if (chatContext?.selectedConversation != null) {
      let indx = getConversationindex(
        chatContext?.conversations,
        chatContext?.selectedConversation
      );
      let hist = chatContext?.conversations[indx].history;
      if (hist != null) {
        hist = hist.slice().reverse();
        setHistory(hist);
      } else {
        setHistory([]);
      }
      setChatContext({
        ...chatContext,
        action: null,
      });
    }
  }

  useEffect(() => {
    updateConversationHistory();
  }, [chatContext?.action]);

  useEffect(() => {
    updateConversationHistory();
  }, []);

  return (
    <>
      {history.length > 0 && (
        <>
          {history.map((message, index) => (
            <Message
              message={message}
              index={index}
              generateSpeech={generateSpeech}
              key={"hist_" + index}
            />
          ))}
        </>
      )}
    </>
  );
}

function Message({ message, index, generateSpeech }) {
  return (
    <Container mt={6} style={{ position: "relative" }}>
      <Title order={3} color="blue.6">
        {message.question}
      </Title>
      <Text>
        <ReactMarkdown>{message.response}</ReactMarkdown>
      </Text>
      {/*<SpeechGenerate message={message.response} />*/}
      {message.speech == null && (
        <Button
          mt={16}
          onClick={() => generateSpeech(message.response, index)}
          variant="outline"
        >
          [<PlayIcon />]
        </Button>
      )}

      {message.speech != null && (
        <>
          <AudioPlayer filename={message.speech} />
        </>
      )}
    </Container>
  );
}
