import { Button, Container, Group, Input, Loader } from "@mantine/core";
import { useContext, useState } from "react";
import { ChatContext, ChatDispatchContext } from "components/Context/context";
import { ShowError, ShowInfo, ShowSuccess } from "utils/notifications";
import { getConversationindex } from "utils/conv_helpers";
import GenerateVideo from "components/Chat/GenerateVideo";

// retrieve the backend url from the environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API;
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

// import styles
import styles from "styles/Chat.module.css";

// delay function to wait for the audio to be loaded
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatForm(props) {
  // retrieve the conversation from the props
  const { conversation } = props;

  // retrieve the context and dispatch from the context provider to read and update the state
  const chatContext = useContext(ChatContext);
  const setChatContext = useContext(ChatDispatchContext);

  // set the state for the question, question error, processing, generate video and answer
  // qestion: the question asked by the user
  // questionError: the error message to display if the question is empty
  // processing: a boolean to indicate if the request is being processed
  // genVideo: a boolean to indicate if the video is being generated
  // answer: the answer to the question
  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [genVideo, setGenVideo] = useState(false);
  const [answer, setAnswer] = useState("");

  // function to play the sound
  async function playSound(file) {
    setProcessing(true);
    // wait for 1.5 seconds to make sure the audio is loaded
    await delay(1500);
    // create a new audio element and set the source to the file
    const audioElement = new Audio(file);

    // add event listeners to the audio element
    // canplaythrough: the audio is loaded and ready to play
    audioElement.addEventListener("canplaythrough", () => {
      audioElement.play();
    });

    // ended: the audio has finished playing
    audioElement.addEventListener("ended", () => {
      setProcessing(false);
    });
  }

  async function getResponse() {
    let continueRequest = true;

    // check if the question is empty
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
        // retrieve the backend url from the environment variable
        let api_url = "/api/get_response";
        if (BACKEND_URL !== undefined) {
          api_url = `${BACKEND_URL}/get_response`;
        }

        // retrieve the history from the conversation
        let history = [];
        if (conversation.history != null) {
          history = conversation.history;
        }

        // send the request to the backend
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

        // parse the response and catch any errors that occur
        const json = await response.json().catch((err) => {
          console.error(err);
          setProcessing(false);
        });

        // if the response is successful, update the conversation history
        if (json.code == 200) {
          // get the conversations from the context
          let conv = chatContext?.conversations;
          // get the index of the conversation
          let indx = getConversationindex(conv, conversation.id);
          // get the history from the conversation
          let history = [];
          if (conv[indx]?.history != null) {
            history = conv[indx].history;
          }
          // add the question and response to the history
          history.push({
            question: question,
            response: json.response,
          });
          // update the conversation history
          conv[indx].history = history;
          // update the context
          setChatContext({
            ...chatContext, // spread operator
            conversations: conv,
            action: "update history",
          });
          // set processing to false and clear the question so the user can ask another question
          setProcessing(false);
          setQuestion("");
          // return the response
          return json.response;
        }
      } catch (e) {
        // catch any errors that occur
        console.error(e);
        setProcessing(false);
        setQuestion("");
        return null;
      }
    }
    return null;
  }

  // function to generate the voice
  async function getVoice() {
    // get the response from the backend
    const resp_text = await getResponse();
    // if the response is not successful stop the function
    if (resp_text == null) {
      return;
    }
    ShowSuccess("Text response generated");

    setProcessing(true);
    // retrieve the backend url from the environment variable
    let api_url = "/api/elevenlabs";
    if (BACKEND_URL !== undefined) {
      api_url = `${BACKEND_URL}/elevenlabs`;
    }
    // send the request to the backend
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ messages: resp_text, key: LOCAL_KEY }),
    });

    ShowInfo("Generating speech");

    // parse the response and catch any errors that occur
    const json = await response
      .json()
      .catch((err) => {
        console.error(err);
        setProcessing(false);
        ShowError("Error", "Cant generate speech");
      })
      .then(async (res) => {
        // if the response is successful, play the sound
        if (res.error === null) {
          const s_id = res.response;
          await playSound(`/resp/r_${s_id}.mp3`);
        }
      });
  }

  // function to generate the video
  async function getVideo() {
    // get the response from the backend
    const resp_text = await getResponse();
    if (resp_text == null) {
      return;
    }
    ShowSuccess("Text response generated");
    setProcessing(true);
    ShowInfo("Generating video");
    // update the answer and set the genVideo to true to start the video generation
    setAnswer(resp_text);
    setGenVideo(true);
  }

  return (
    <Container className={styles.chat_form}>
      <GenerateVideo
        genVideo={genVideo}
        setGenVideo={setGenVideo}
        text={answer}
        updProcessing={setProcessing}
      />
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
