import textToSpeech from "elevenlabs-api";
const fs = require("fs");
const path = require("path");

// retrieve API_KEY from environment variable
const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API;
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;
const VOICE_ID = "MF3mGyEYCl7XYWbV9V6O";
const EXPIRE_DAYS = process.env.NEXT_PUBLIC_EXPIRE_DAYS;

async function deleteOldFiles() {
  // create folder if not exist
  if (!fs.existsSync("./public/resp")) {
    fs.mkdirSync("./public/resp");
  }

  // read all files in folder
  const folderPath = path.join(process.cwd(), "public", "resp");
  const files = fs.readdirSync("./public/resp");

  // get the timestamp of the desired date
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - EXPIRE_DAYS);

  // delete all files older than the desired date
  files.forEach((file) => {
    // get the file name
    const filePath = path.join(folderPath, file);
    // get the file stats
    const fileStats = fs.statSync(filePath);
    // get the file modified time
    const fileModifiedTime = new Date(fileStats.mtime);
    // compare the file modified time with the desired date
    if (fileModifiedTime < twoDaysAgo) {
      // delete the file
      fs.unlinkSync(filePath);
    }
  });
}

export default async function handler(req, res) {
  // allow only POST method
  if (req.method === "POST") {
    // add error handling in case we have any problems with the filesystem
    try {
      // get the current timestamp
      const timestamp = new Date().getTime();
      const filename = `public/resp/r_${timestamp.toFixed(0)}.mp3`;

      // get the message and key from the request body
      const { message, key } = req.body;

      // delete old files
      await deleteOldFiles();

      // check if the key is valid
      if (key !== LOCAL_KEY) {
        res.status(404).json({ error: "Access denied" });
        return;
      }

      // check if the message is empty
      if (message.length == 0) {
        res.status(404).json({ error: "Empty message" });
        return;
      }
      
      try {
        // call the API to convert text to speech
        textToSpeech(API_KEY, message, VOICE_ID, filename).then(  // after the conversion is done return the filename
          async (response) => {
            res
              .status(200)
              .json({ error: null, response: timestamp.toFixed(0) });
          }
        );
      } catch (error) {
        console.error(
          `An error occurred while converting text to speech: ${error}`
        );
      }
    } catch (error) {
      console.error(
        `An error occurred while converting text to speech: ${error}`
      );
      res
        .status(404)
        .json({ error: "An error occurred while converting text to speech" });
    }
  } else {
    res.status(404).json({ error: "Not found" });
  }
}
