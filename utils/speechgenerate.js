import { useState, useEffect } from "react";
import axios from "axios";
import {Button} from "@mantine/core";

const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API;
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;
const VOICE_ID = "MF3mGyEYCl7XYWbV9V6O";
const EXPIRE_DAYS = process.env.NEXT_PUBLIC_EXPIRE_DAYS;

// Define a function called textToSpeech that takes in a string called inputText as its argument.
const textToSpeech = async (inputText) => {
  // Set options for the API request.
  const options = {
    method: "POST",
    url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    headers: {
      accept: "audio/mpeg", // Set the expected response type to audio/mpeg.
      "content-type": "application/json", // Set the content type to application/json.
      "xi-api-key": `${API_KEY}`, // Set the API key in the headers.
    },
    data: {
      text: inputText, // Pass in the inputText as the text to be converted to speech.
    },
    responseType: "arraybuffer", // Set the responseType to arraybuffer to receive binary data as response.
  };

  // Send the API request using Axios and wait for the response.
  const speechDetails = await axios.request(options);

  // Return the binary audio data received from the API response.
  return speechDetails.data;
};

export default function SpeechGenerate(props) {
  const { message } = props;
  // Define a state variable to hold the audio URL
  const [audioURL, setAudioURL] = useState(null);

  // Define a function to fetch the audio data and set the URL state variable
  const handleAudioFetch = async () => {
    // Call the textToSpeech function to generate the audio data for the text "Hello welcome"
    const data = await textToSpeech(message);
    // Create a new Blob object from the audio data with MIME type 'audio/mpeg'
    const blob = new Blob([data], { type: "audio/mpeg" });
    // Create a URL for the blob object
    const url = URL.createObjectURL(blob);
    // Set the audio URL state variable to the newly created URL
    setAudioURL(url);
  };

  // Use the useEffect hook to call the handleAudioFetch function once when the component mounts
  // useEffect(() => {
  //   handleAudioFetch();
  // }, []);

  // Render an audio element with the URL if it is not null
  return (
    <div>
      {audioURL ? (
        <audio autoPlay controls>
          <source src={audioURL} type="audio/mpeg" />
        </audio>
      ) : (
        <Button onClick={handleAudioFetch} mt={16}>
	        Generate Speech<
	        /Button>
      )}
    </div>
  );
}
