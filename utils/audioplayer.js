import React, { useState } from "react";
import { PlayIcon } from "@radix-ui/react-icons";
import { Button } from "@mantine/core";

const AudioPlayer = ({ filename }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const audioFile = filename; // Replace with your audio file path

  const handlePlay = () => {
    setIsPlaying(true);
    const audioElement = new Audio(audioFile);
    setAudio(audioElement);

    audioElement.addEventListener("canplaythrough", () => {
      audioElement.play();
    });

    audioElement.addEventListener("ended", () => {
      setIsPlaying(false);
    });
  };

  return (
    <div>
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
    </div>
  );
};

export default AudioPlayer;
