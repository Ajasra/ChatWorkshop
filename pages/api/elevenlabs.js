import textToSpeech from "elevenlabs-api";
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API;
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;
const VOICE_ID = "MF3mGyEYCl7XYWbV9V6O";
const EXPIRE_DAYS = process.env.NEXT_PUBLIC_EXPIRE_DAYS;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function deleteOldFiles ()  {
  const folderPath = path.join(process.cwd(), "public", "resp");
  const files = fs.readdirSync("./public/resp");

  const currentDate = new Date();
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - EXPIRE_DAYS);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const fileStats = fs.statSync(filePath);
    const fileModifiedTime = new Date(fileStats.mtime);

    if (fileModifiedTime < twoDaysAgo) {
      fs.unlinkSync(filePath);
    }
  });
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const timestamp = new Date().getTime();
    const filename = `public/resp/r_${timestamp.toFixed(0)}.mp3`;

    let message = req.body.messages;
    let key = req.body.key;

    await deleteOldFiles();

    if (key !== LOCAL_KEY) {
      res.status(404).json({ error: "Access denied" });
      return;
    }

    if (message.length == 0) {
      res.status(404).json({ error: "Empty message" });
      return;
    }

    try {
      textToSpeech(API_KEY, message, VOICE_ID, filename).then(
        async (response) => {
          // add short delay to be sure it finish writing in file
          // await delay(1500);
          console.log(`Success, Audio saved as: ${filename}`);
          res.status(200).json({ error: null, response: timestamp.toFixed(0) });
        }
      );
    } catch (error) {
      console.error(
        `An error occurred while converting text to speech: ${error}`
      );
    }
  } else {
    res.status(404).json({ error: "Not found" });
  }
}
