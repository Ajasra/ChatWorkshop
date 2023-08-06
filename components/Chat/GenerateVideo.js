import { Center, Container, Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { ShowError } from "utils/notifications";
import VideoPlayer from "components/Video/VideoPlayer";

// read environment variables
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API;

// import styles
import styles from "styles/Video.module.css";

export default function GenerateVideo(props) {
  // retrieve props from parent component
  const { text = "", genVideo, setGenVideo, updProcessing } = props;

  // define states
  // processing: true if video is being generated
  const [processing, setProcessing] = useState(false);
  // video_id: id of the video being generated
  const [video_id, setVideoId] = useState();
  // videoUrl: url of the video being generated
  const [videoUrl, setVideoUrl] = useState(null);
  // isVideoFinished: true if video is finished
  const [isVideoFinished, setIsVideoFinished] = useState(false);

  // height: height of the video
  const [height, setHeight] = useState(400);

  // function to generate video from text using the backend API
  async function generateVideo(text) {
    // set processing to true to prevent user from generating another video
    setProcessing(true);
    // reset video url and isVideoFinished
    setVideoUrl(null);
    setIsVideoFinished(false);

    // define api url
    let api_url = "/api/generateVideoAPI";
    if (BACKEND_URL !== undefined) {
      api_url = `${BACKEND_URL}/generateVideoAPI`;
    }

    // call backend API
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ text: text, api_key: LOCAL_KEY }),
    });

    // parse response to json format and catch error if any
    const json = await response.json().catch((err) => {
      console.log(err);
      ShowError("Error", "Error generating video");
    });

    // check if response is not null and if there is no error
    if (json?.response !== null) {
      // check if we run out of credit
      if (json.response?.kind == "InsufficientCreditsError") {
        console.error("Insufficient credit");
        ShowError("Error", "Insufficient credit");
        // set processing to false to allow user to generate another video
        updProcessing(false);
        // reset video id to clear video player
        setVideoId(null);
      }
      // check if video id is not null
      if (json.response?.id) {
        // set video id to proceed to check video status
        setVideoId(json.response.id);
      }
    } else {
      console.error("json", json);
      ShowError("Error", "Error generating video");
    }
  }

  // function to check video status using the backend API and update videoUrl
  async function checkVideo() {
    // we only check video status if processing is true
    if (processing) {
      try {
        // define api url
        const response = await fetch("/api/checkVideo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ video_id: video_id, api_key: LOCAL_KEY }),
        });

        // parse response to json format and catch error if any
        const json = await response.json().catch((err) => {
          console.error(err);
          ShowError("Error", "Error generating video");
        });

        // check if response is not null and if there is no error
        if (json.response !== null) {
          // check if video is done
          if (json.response.status == "done") {
            // set isVideoFinished to true to show video player
            setVideoUrl(json.response.result_url);
            // setProcessing to false to allow user to generate another video
            setProcessing(false);
          }
        }
      } catch (e) {
        ShowError("Error", "Coundn't fetch video");
        setProcessing(false);
      }
    }
  }

  // check video status every 2 seconds
  useEffect(() => {
    let interval;
    if (video_id != null && processing) {
      interval = setInterval(checkVideo, 2000);
      return () => clearInterval(interval);
    }
  }, [video_id, processing]);

  // set processing to false when videoUrl is not null
  useEffect(() => {
    if (videoUrl != null) {
      setProcessing(false);
      updProcessing(false);
    }
  }, [videoUrl]);

  // set height to 250px if it is on mobile
  useEffect(() => {
    // check if it on mobile, if it is, set height to 300px
    if (window.innerWidth < 768) {
      setHeight(250);
    }
  }, []);

  // generate video when genVideo is true
  useEffect(() => {
    if (genVideo) {
      generateVideo(text);
      setGenVideo(false);
    }
  }, [genVideo]);

  // reset videoUrl and videoId when isVideoFinished is true
  useEffect(() => {
    if (isVideoFinished) {
      setVideoUrl(null);
      setVideoId(null);
      setProcessing(false);
    }
  }, [isVideoFinished]);

  // return video container
  // if videoUrl is not null and isVideoFinished is false, show video player
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
