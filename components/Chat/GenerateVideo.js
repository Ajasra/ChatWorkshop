import { Center, Container, Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { ShowError } from "utils/notifications";

const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API;

import styles from "styles/Video.module.css";
import VideoPlayer from "components/Video/VideoPlayer";

export default function GenerateVideo(props) {
  const { text = "", genVideo, setGenVideo, updProcessing } = props;

  const [processing, setProcessing] = useState(false);
  const [video_id, setVideoId] = useState();
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoFinished, setIsVideoFinished] = useState(false);

  const [height, setHeight] = useState(400);

  console.log("videoUrl", videoUrl);
  console.log("video_id", video_id);
  console.log("processing", processing);
  console.log("isVideoFinished", isVideoFinished);

  async function generateVideo(text) {
    setProcessing(true);
    setVideoUrl(null);
    setIsVideoFinished(false);

    let api_url = "/api/generateVideoAPI";
    if (BACKEND_URL !== undefined) {
      api_url = `${BACKEND_URL}/generateVideoAPI`;
    }

    const response = await fetch(api_url, {
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

    if (json?.response !== null) {
      if (json.response?.kind == "InsufficientCreditsError") {
        console.error("Insufficient credit");
        ShowError("Error", "Insufficient credit");
        updProcessing(false);
        setVideoId(null);
      }
      if(json.response?.id){
        setVideoId(json.response.id);
      }
    } else {
      console.error("json", json);
      ShowError("Error", "Error generating video");
    }
  }

  async function checkVideo() {
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
          console.error(err);
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
      generateVideo(text);
      setGenVideo(false);
    }
  }, [genVideo]);

  useEffect(() => {
    if (isVideoFinished) {
      setVideoUrl(null);
      setVideoId(null);
      setProcessing(false);
    }
  }, [isVideoFinished]);

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
    </Container>
  );
}
