// This component is used to play video from the url provided by the parent component
// import useEffect, useRef, useState from react library
import { useEffect, useRef, useState } from "react";

export default function VideoPlayer(props) {
  // retrieve videourl, height, setIsVideoFinished from props (passed from parent component)
  const { videourl, height, setIsVideoFinished } = props;
  
  // create state variable prevVideo and setPrevVideo function to check if videourl has changed
  const [prevVideo, setPrevVideo] = useState(null);

  // create videoRef to reference video element to handle video play
  const videoRef = useRef(null);

  // useEffect to call when videourl has changed
  useEffect(() => {
    // if videourl is not null and videourl is not equal to prevVideo
    if (videourl !== null && videourl !== prevVideo) {
      // set prevVideo to videourl
      setPrevVideo(videourl);
      // load video and play video
      videoRef.current.load();
      videoRef.current.play();
      // set isVideoFinished to false
      setIsVideoFinished(false);
    }
  }, [videourl]);

  // handleVideoEnded function to set isVideoFinished to true
  const handleVideoEnded = () => {
    setIsVideoFinished(true);
  };

  // return video element with videourl as source
  // if videourl is not null
  return (
    <video ref={videoRef} height={height} onEnded={handleVideoEnded}>
      {videourl && <source src={videourl} type="video/mp4" />}
    </video>
  );
}
