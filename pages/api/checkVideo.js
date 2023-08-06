// This file used to check if the video finish processing on D-ID server
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;
const generate_url = "https://api.d-id.com/talks";
const DID_KEY = process.env.NEXT_PUBLIC_DID_KEY;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method === "POST") {
    // Retrieve the video_id and api_key from the request body
    const { api_key, video_id } = req.body;
    
    // Check if the api_key is correct
    if (api_key !== LOCAL_KEY) {
        res.status(401).json({ error: "not authorized" });
        return;
    }

    // Send a request to D-ID server to check if the video finish processing
    const response = await fetch(generate_url + "/" + video_id, {
      method: "GET",
      headers: {
        // Send the api_key in the header for authentication
        Authorization: `Basic ${DID_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // Check if the response is ok
    response
      .json() // Parse the JSON response
      .then((data) => {
        // Send the response back to the client
        // console.log(data);
        res.status(200).json({ response: data });
      })
      .catch((err) => {
        // Send the error back to the client
        console.error(err);
        res.status(200).json({ response: null });
      });
  } else {
    res.status(401).json({ error: "not authorized" });
  }
}
