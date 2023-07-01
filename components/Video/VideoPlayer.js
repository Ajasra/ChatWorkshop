import { useEffect, useRef } from "react";

export default function VideoPlayer(props) {
  const { videourl, height, setIsVideoFinished } = props;

  const videoRef = useRef(null);

  useEffect(() => {
    if (videourl !== null) {
      videoRef.current.load();
      videoRef.current.play();
      setIsVideoFinished(false);
    }
  }, [videourl]);

  const handleVideoEnded = () => {
    setIsVideoFinished(true);
  };

  return (
    <video ref={videoRef} height={height} onEnded={handleVideoEnded}>
      {videourl && <source src={videourl} type="video/mp4" />}
    </video>
  );
}
