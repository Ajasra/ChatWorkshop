// set up the environment variables
const generate_url = "https://api.d-id.com/talks";
const DID_KEY = process.env.NEXT_PUBLIC_DID_KEY;
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const EXPRESSION = "happy";
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method === "POST") {
    // Retrieve the name from the body of the request
    const { api_key, text } = req.body;

    // Check that the name is valid
    if (api_key !== LOCAL_KEY) {
      res.status(401).json({ error: "not authorized" });
      return;
    }

    // Create the payload
    // documentation for each parameter can be found here: https://docs.d-id.com/reference/createtalk
    const payload = JSON.stringify({
      script: {
        type: "text",
        subtitles: "false",
        provider: {
          type: "elevenlabs",
          voice_id: VOICE_ID,
        },
        ssml: "false",
        input: text,
      },
      config: {
        fluent: true,
        pad_audio: 0.2,
        stitch: true,
        driver_expressions: {
          expressions: [
            {
              expression: EXPRESSION,
              start_frame: 0,
              intensity: 0.5,
            },
          ],
        },
      },
      source_url:
        "https://create-images-results.d-id.com/auth0%7C649d87762049e43702edc226/upl_JjUMzzt0b6vxmwT-SmVx6/image.png",
    });

    // handling the errors and the response
    try {
      // Make the request to the D-ID API
      const response = await fetch(generate_url, {
        method: "POST",
        headers: {
          // Authorization header is required for all requests
          Authorization: `Basic ${DID_KEY}`,
          "Content-Type": "application/json",
          Accept: "*/*",
          Connection: "keep-alive",
        },
        body: payload,
      });

      // Handle the response
      response
        .json() // parse the response as JSON
        .then((data) => {
          // send the response back to the client
          res.status(200).json({ response: data });
        })
        .catch((err) => {
          // handle the error
          res.status(500).json({ error: err });
        });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e });
    }
  } else {
    res.status(404).json({ error: "Not found" });
  }
}
