import { Button, Center, Container, Image } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { ShowError } from "utils/notifications";

const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

import styles from "styles/Video.module.css";
import VideoPlayer from "components/Video/VideoPlayer";

export default function GenerateVideo(props) {
  const { text = "", genVideo, setGenVideo, updProcessing } = props;

  const [processing, setProcessing] = useState(false);
  const [video_id, setVideoId] = useState();
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoFinished, setIsVideoFinished] = useState(false);

  const [height, setHeight] = useState(400);

  function playVideo() {
    // generateSpeech(text);
    setProcessing(true);
    setIsVideoFinished(false);
    setVideoId("tlk_wiql2Fw6CqpeL6E361byr");
  }

  async function generateSpeech(text) {
    setProcessing(true);
    setVideoUrl(null);

    const response = await fetch("/api/generateVideoAPI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ text: text, api_key: LOCAL_KEY }),
    });

    const json = await response.json().catch((err) => {
      console.log(err);
      ShowError("Error", "Error generating video");
    });

    if (json.response !== null) {
      console.log("json.response", json.response);
      setVideoId(json.response.id);
    } else {
      console.log("json", json);
      ShowError("Error", "Error generating video");
    }
  }

  async function checkVideo() {
    console.log(processing);
    if (processing) {
      try {
        const response = await fetch("/api/checkVideo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ video_id: video_id, api_key: LOCAL_KEY }),
        });

        const json = await response.json().catch((err) => {
          console.log(err);
          ShowError("Error", "Error generating video");
        });

        if (json.response !== null) {
          if (json.response.status == "done") {
            setVideoUrl(json.response.result_url);
            setProcessing(false);
          }
        }
      } catch (e) {
        ShowError("Error", "Coundn't fetch video");
        setProcessing(false);
      }
    }
  }

  useEffect(() => {
    let interval;
    if (video_id != null && processing) {
      interval = setInterval(checkVideo, 2000);
      return () => clearInterval(interval);
    }
  }, [video_id, processing]);

  useEffect(() => {
    if (videoUrl != null) {
      setProcessing(false);
      updProcessing(false);
    }
  }, [videoUrl]);

  useEffect(() => {
    // check if it on mobile, if it is, set height to 300px
    if (window.innerWidth < 768) {
      setHeight(250);
    }
  }, []);

  useEffect(() => {
    if (genVideo) {
      console.log("generate video");
      console.log(text);
      generateSpeech(text);
      setGenVideo(false);
    }
  }, [genVideo]);
  return (
    <Container className={styles.video_container}>
      <Image src="/sources/character.png" height={height} fit={"contain"} />
      {videoUrl != null && !isVideoFinished && (
        <Center className={styles.video_result}>
          <VideoPlayer
            videourl={videoUrl}
            height={height}
            setIsVideoFinished={setIsVideoFinished}
          />
        </Center>
      )}
      {/*<Button*/}
      {/*  className={styles.video_button}*/}
      {/*  loading={processing}*/}
      {/*  disabled={processing}*/}
      {/*  onClick={playVideo}*/}
      {/*  color="blue"*/}
      {/*>*/}
      {/*  Generate Video*/}
      {/*</Button>*/}
    </Container>
  );
}
