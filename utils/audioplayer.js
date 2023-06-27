import React, { useEffect, useState } from "react";
import { PlayIcon } from "@radix-ui/react-icons";
import { Button } from "@mantine/core";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const AudioPlayer = ({ filename }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const audioFile = filename; // Replace with your audio file path
  const [fileExists, setFileExists] = useState(true);

  // checking if fil still exist
  useEffect(() => {
    const checkFileExists = async () => {
      try {
        const response = await fetch("/api/checkFile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ filename: audioFile }),
        });
        const resp = await response
          .json()
          .catch((err) => {
            setFileExists(false);
          })
          .then((res) => {
            setFileExists(res.exists);
          });

        //
      } catch (error) {
        setFileExists(false);
        console.error("Error checking file existence:", error);
      }
    };
    if (audioFile != null && audioFile != undefined) {
      checkFileExists();
    }
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);

    const audioElement = new Audio(audioFile);
    setAudio(audioElement);

    // await delay(1000);

    audioElement.addEventListener("canplaythrough", () => {
      audioElement.play();
    });

    audioElement.addEventListener("ended", () => {
      setIsPlaying(false);
    });
  };

  return (
    <div>
      {fileExists && (
        <Button
          // className={styles.play_icon}
          mt={16}
          onClick={handlePlay}
          disabled={isPlaying}
          loading={isPlaying}
        >
          <PlayIcon />
          <i className="fa-solid fa-copy"></i>
        </Button>
      )}
    </div>
  );
};

export default AudioPlayer;
