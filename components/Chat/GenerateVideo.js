import { Button } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { ShowError } from "utils/notifications";

const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

const VideoPlayer = (props) => {
  const { videourl } = props;

  const videoRef = useRef(null);

  useEffect(() => {
    if (videourl !== null) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [videourl]);

  return (
    <div>
      <video ref={videoRef}>
        {videourl && <source src={videourl} type="video/mp4" />}
      </video>
    </div>
  );
};

export default function GenerateVideo(props) {
  const {
    text = "Of course, dear God! Here's another five-word haiku-style joke for you:\n" +
      "\n" +
      "Coffee spills, heartache brews, Stains on shirt, love's bitter stain, Dry cleaner, my savior.\n" +
      "\n" +
      "May this little haiku bring a smile to your divine lips and a chuckle to your cosmic heart!",
  } = props;

  const [processing, setProcessing] = useState(false);
  const [video_id, setVideoId] = useState();
  const [videoUrl, setVideoUrl] = useState(null);

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
    }
  }, [videoUrl]);

  return (
    <>
      {videoUrl != null && <VideoPlayer videourl={videoUrl} />}
      <Button
        loading={processing}
        disabled={processing}
        onClick={() => {
          // generateSpeech(text);
          setProcessing(true);
          setVideoId("tlk_JICJeyHLmWyI0ZaAUvXEf");
        }}
        color="blue"
      >
        Generate Video
      </Button>
    </>
  );
}
