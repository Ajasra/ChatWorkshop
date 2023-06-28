import { Container, Title, Text, Button } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { PlayIcon } from "@radix-ui/react-icons";
import { ChatContext, ChatDispatchContext } from "components/Context/context";
import { getConversationindex } from "utils/conv_helpers";
import ReactMarkdown from "react-markdown";

import useSound from "use-sound";
import AudioPlayer from "utils/audioplayer";
import SpeechGenerate from "utils/speechgenerate";

const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatHistory(props) {
  const { conversation } = props;

  const chatContext = useContext(ChatContext);
  const setChatContext = useContext(ChatDispatchContext);

  const [speechFile, setSpeechFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [historySize, setHistorySize] = useState(0);

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

    let api_url = "/api/elevenlabs";
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ messages: text, key: LOCAL_KEY }),
    });

    const json = await response.json().catch((err) => {
      console.error(err);
      setProcessing(false);
    });

    if (json.error === null) {
      const s_id = json.response;

      let conversation = chatContext.conversations;
      let indx = getConversationindex(conversation, props.conversation.id);
      let history = conversation[indx].history;
      history[id] = {
        ...history[id],
        speech: `/resp/r_${s_id}.mp3`,
      };
      conversation[indx].history = history;
      setChatContext({
        ...chatContext,
        conversations: conversation,
      });
      await playSound(`/resp/r_${s_id}.mp3`);
    }
  }

  useEffect(() => {
    if (conversation?.history != null) {
      setHistorySize(conversation.history.length);
    }
  }, [conversation]);

  // console.log(historySize);

  return (
    <>
      {conversation?.history != null ? (
        <>
          {conversation?.history.map((message, index) => (
            <Container
              key={"hist_" + index}
              mt={32}
              style={{ position: "relative" }}
            >
              <Title order={3} color="blue.6">
                {message.question}
              </Title>
              <Text>
                <ReactMarkdown>{message.response}</ReactMarkdown>
              </Text>
              <SpeechGenerate message={message.response} />
              {index >= historySize - 1 && message.speech == null && (
                <Button
                  mt={16}
                  // className={styles.play_icon}
                  onClick={() => generateSpeech(message.response, index)}
                >
                  <PlayIcon />
                  <i className="fa-solid fa-copy"></i>
                </Button>
              )}

              {message.speech != null && (
                <>
                  <AudioPlayer filename={message.speech} />
                </>
              )}
            </Container>
          ))}
        </>
      ) : (
        <div>
          New conversation. Please type your question and we would try to assist
          you.
        </div>
      )}
    </>
  );
}
